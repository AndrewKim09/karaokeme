import { faCircle, faPause, faPlay, faVolumeHigh, faVolumeMute } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Option, optionClasses, Select, Typography } from "@mui/joy";
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from 'wavesurfer.js/dist/plugins/record'

interface recorderParams {
  setTime: (time: number) => void,
  handlePlayPause: () => void,
  duration: number
  time: number
}

const WaveformRecorder: React.FC<recorderParams> = ({setTime, handlePlayPause, duration, time }) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const recorderWaveSurfer = useRef<WaveSurfer | null>(null);

  const recordPluginRef = useRef<RecordPlugin | null>(null);
  const [recording, setRecording] = useState(false);

  const [timeStartedAt, setTimeStartedAt] = useState(0);
  const [timeEndedAt, setTimeEndedAt] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [playable, setPlayable] = useState(false);

  const [recordingDevices, setRecordingDevices] = useState<MediaDeviceInfo[]>([])

  const [recordedMuted, setRecordedMuted] = useState(false);
  const [recordedVolume, setRecordedVolume] = useState(0);

  const recordedAudioRef = useRef<HTMLAudioElement>(null);
  const recordedBlob = useRef<Blob | null>(null);

  let scrollingWaveform = false
  let continuousWaveform = true

  const instrumentalWaveSurferOption = (ref: HTMLElement) => ({
    container: ref,
    waveColor: '#ccc',
    backgroundColor: '#020',
    progressColor: '#9178ff',
    cursorColor: 'transparent',
    response: true,
    height: 40,
    width: '100%',
    normalize: true,
    backend: "WebAudio" as "WebAudio", // Explicitly type the backend
    barWidth: 2,
    barGap: 3,
  })


  useEffect(() => {
    if(!waveformRef.current || !duration || duration === 0 || !recordedAudioRef.current) {
      console.log('Waveform not found')
      return
    }

    recorderWaveSurfer.current = WaveSurfer.create(instrumentalWaveSurferOption(waveformRef.current));
    // recorderWaveSurfer.current.setVolume(0)

    let newRecord = recorderWaveSurfer.current.registerPlugin(
      RecordPlugin.create({
        renderRecordedAudio: false,
        scrollingWaveform,
        continuousWaveform,
        continuousWaveformDuration: duration,
      }),
    );

    recordPluginRef.current = newRecord;
    
    newRecord.on("record-end", async (blob) => {
      setPlayable(false)
      if(!recordedAudioRef.current) return
      console.log("Recording ended, received blob:", blob);

      if (!blob) {
        console.error("No recording data received.");
        return;
      }


      let newBlob = blob;



      if (recordedAudioRef.current.src) {
        const mergedBlob = await mergeBlobs(newBlob, blob);
        newBlob = mergedBlob;
      }
      recordedBlob.current = newBlob;
      recordedAudioRef.current.src = URL.createObjectURL(newBlob)
      recorderWaveSurfer.current?.loadBlob(newBlob);
      setPlayable(true);
    });



    const micSelect = document.querySelector('#mic-select')
    if(!micSelect) {
      console.log('Mic select not found')
      return
    }

    RecordPlugin.getAvailableAudioDevices().then((devices) => {
      setRecordingDevices(devices)
    })
  
    waveformRef.current.addEventListener("click", (e) => {
      if (!recorderWaveSurfer.current || !recordedAudioRef.current) return;
  
      const rect = waveformRef.current!.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickRatio = clickX / rect.width;
  
      const duration = recorderWaveSurfer.current.getDuration();
      recorderWaveSurfer.current.seekTo(clickRatio);
      recordedAudioRef.current.currentTime = clickRatio * duration;
      setTimeStartedAt(clickRatio * duration);
      setTime(clickRatio * duration);
      console.log(`Seeking to: ${clickRatio * duration}s`);
    });

    recordedAudioRef.current.addEventListener('ended', () => {
      console.log("Audio ended");
      setIsPlaying(false);
      
    })

    return () => {
      if (recorderWaveSurfer.current) {
        recorderWaveSurfer.current.destroy();
        recorderWaveSurfer.current = null;
      }
      if (recordPluginRef.current) {
        recordPluginRef.current.destroy();
        recordPluginRef.current = null;
      }
      if (recordedAudioRef.current) {
        recordedAudioRef.current.src = "";
        recordedAudioRef.current = null;
      }
    };

  }, [waveformRef, duration, recordedAudioRef])

  const mergeBlobs = async (blob1: Blob, blob2: Blob): Promise<Blob> => {
    // Convert both blobs to ArrayBuffers
    const arrayBuffer1 = await blob1.arrayBuffer();
    const arrayBuffer2 = await blob2.arrayBuffer();
  
    // Concatenate the ArrayBuffers
    const combinedArrayBuffer = new Uint8Array(arrayBuffer1.byteLength + arrayBuffer2.byteLength);
    combinedArrayBuffer.set(new Uint8Array(arrayBuffer1), 0);
    combinedArrayBuffer.set(new Uint8Array(arrayBuffer2), arrayBuffer1.byteLength);
  
    // Return a new Blob from the combined ArrayBuffer
    return new Blob([combinedArrayBuffer], { type: "audio/wav" });  // Adjust type if needed
  };

  const toggleRecording = () => {
    if (!recordPluginRef.current) {
      console.log("Record plugin not initialized.");
      return;
    }

    if (!recording) {
      recordPluginRef.current.startRecording();
    } else {
      recordPluginRef.current.stopRecording();
    }

    setRecording(!recording);
    handlePlayPause();
  };

  const togglePlayback = () => {
    if (!recorderWaveSurfer.current || !playable) return;
    recorderWaveSurfer.current.playPause();
    setIsPlaying(!isPlaying);
  };

  const handleRecordedVolumeChange = (newVolume: number) => {
    if(!recordedAudioRef.current) return;
    setRecordedVolume(newVolume);
    recordedAudioRef.current.volume = newVolume;
    setRecordedMuted(newVolume === 0)
  }

  
  const handleRecordedMute = () => {
    if (recordedAudioRef.current) {
      recordedAudioRef.current.volume = recordedAudioRef ? recordedVolume : 0;
    }
    setRecordedMuted(!recordedMuted);
  }

  return (
    <div>
      <div className="flex items-center w-[100%] h-[70px]">
        <div className="flex flex-col controls h-[100%] mt-4 mr-4">
          <input
            className="audio-slider"
            type='range'
            id='volume'
            name='volume'
            min='0'
            max='1'
            step='0.05'
            onChange={(e) => handleRecordedVolumeChange(parseFloat(e.target.value))}
            value={recordedMuted ? 0 : recordedVolume}
          />
          <button onClick={handleRecordedMute}>
            <FontAwesomeIcon icon={!recordedMuted ? faVolumeHigh : faVolumeMute} />
          </button>
        </div>
        <div id="waveform" ref={waveformRef} className="my-4 w-[100%]"></div>
      </div>

      {/* Record Button */}
      <button onClick={toggleRecording} className="my-4 text-lg">
        <FontAwesomeIcon
          className={recording ? "text-black" : "text-red-500"}
          icon={recording ? faPause : faCircle}
        />
      </button>

      {/* Playback Button (Only shows after recording) */}
      {playable && !recording && (
        <button onClick={togglePlayback} className="my-4 ml-2 text-lg">
          <FontAwesomeIcon
            className={isPlaying ? "text-black" : "text-blue-500"}
            icon={isPlaying ? faPause : faPlay}
          />
        </button>
      )}


      <div className="flex items-center justify-center">
        <Typography>Microphone: </Typography>
        <Select id="mic-select" className="w-20">
          {recordingDevices? recordingDevices.map((device, index) => (
            <Option key={index} value={device.deviceId}>{device.label}</Option>
          ))
          : <Option value="default">Default</Option>}
        </Select>
      </div>

      <audio className="" ref={recordedAudioRef} controls/>
    </div>
  );
};

export default WaveformRecorder;
