import { faCircle, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Option, optionClasses, Select, Typography } from "@mui/joy";
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from 'wavesurfer.js/dist/plugins/record'

interface recorderParams {
  setTime: (time: number) => void,
  handlePlayPause: () => void
}

const WaveformRecorder: React.FC<recorderParams> = ({setTime, handlePlayPause}) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const recorderWaveSurfer = useRef<WaveSurfer | null>(null);
  const recordingRef = useRef<HTMLDivElement>(null);

  const [record, setRecord] = useState<RecordPlugin | null>(null);
  const [recording, setRecording] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  const [recordingDevices, setRecordingDevices] = useState<MediaDeviceInfo[]>([])

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
    normalize: true,
    backend: "WebAudio" as "WebAudio", // Explicitly type the backend
    barWidth: 2,
    barGap: 3
  })


  useEffect(() => {
    if(!waveformRef.current) {
      console.log('Waveform not found')
      return
    }

    recorderWaveSurfer.current = WaveSurfer.create(instrumentalWaveSurferOption(waveformRef.current));

    let newRecord = recorderWaveSurfer.current.registerPlugin(
      RecordPlugin.create({
        renderRecordedAudio: false,
        scrollingWaveform,
        continuousWaveform,
        continuousWaveformDuration: 30, // optional
      }),
    );

    setRecord(newRecord)
    
    newRecord.on("record-end", (blob) => {
      console.log("Recording ended, received blob:", blob);

      if (!blob) {
        console.error("No recording data received.");
        return;
      }

      const url = URL.createObjectURL(blob);
      setRecordedUrl(url);

      // Load the recorded audio into the same WaveSurfer instance
      recorderWaveSurfer.current?.load(url);
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
      if (!recorderWaveSurfer.current) return;
  
      const rect = waveformRef.current!.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickRatio = clickX / rect.width;
  
      const duration = recorderWaveSurfer.current.getDuration();
      recorderWaveSurfer.current.seekTo(clickRatio);
      setTime(clickRatio * duration);
      console.log(`Seeking to: ${clickRatio * duration}s`);
    });

    return () => {
      if (recorderWaveSurfer.current) {
        recorderWaveSurfer.current.destroy();
        recorderWaveSurfer.current = null;
      }
    };


  }, [waveformRef])

  const toggleRecording = () => {
    if (!record) {
      console.log("Record plugin not initialized.");
      return;
    }

    if (!recording) {
      record.startRecording();
    } else {
      record.stopRecording();
    }

    setRecording(!recording);
    handlePlayPause();
  };

  const togglePlayback = () => {
    if (!recorderWaveSurfer.current || !recordedUrl) return;
    recorderWaveSurfer.current.playPause();
    setIsPlaying(!isPlaying);
  };


  return (
    <div>
      <div id="waveform" ref={waveformRef}></div>

      {/* Record Button */}
      <button onClick={toggleRecording} className="text-lg">
        <FontAwesomeIcon
          className={recording ? "text-black" : "text-red-500"}
          icon={recording ? faPause : faCircle}
        />
      </button>

      {/* Playback Button (Only shows after recording) */}
      {recordedUrl && !recording && (
        <button onClick={togglePlayback} className="ml-2 text-lg">
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
    </div>
  );
};

export default WaveformRecorder;
