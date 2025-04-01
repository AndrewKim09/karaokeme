import { faCircle, faPause, faPlay, faVolumeHigh, faVolumeMute } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Option, optionClasses, Select, Typography } from "@mui/joy";
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from 'wavesurfer.js/dist/plugins/record'

interface recorderParams {
  setTime: (time: number) => void,
  handlePlay: () => void,
  handlePause: () => void,
  duration: number,
  time: number,
  playing: boolean
}

const WaveformRecorder: React.FC<recorderParams> = ({setTime, handlePlay, handlePause, duration, time, playing }) => {
  
  const waveformRef = useRef<HTMLDivElement>(null);
  const recorderWaveSurfer = useRef<WaveSurfer | null>(null);

  const recordPluginRef = useRef<RecordPlugin | null>(null);
  const [recording, setRecording] = useState(false);

  // const timeStartedAt = useRef<number>(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [playable, setPlayable] = useState(false);

  const [recordingDevices, setRecordingDevices] = useState<MediaDeviceInfo[]>([])

  const [recordedMuted, setRecordedMuted] = useState(false);
  const [recordedVolume, setRecordedVolume] = useState(0);

  const recordedAudioRef = useRef<HTMLAudioElement>(null);
  const recordedAudioURL = useRef<string | null>(null);
  const recordedBlob = useRef<Blob | null>(null);

  let scrollingWaveform = false
  let continuousWaveform = true

  useEffect(() => {
    console.log(recordedAudioRef.current?.src)
  }, [recordedAudioRef.current?.src])

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
    recorderWaveSurfer.current.setVolume(0)

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
      setPlayable(false);
      if (!recordedAudioRef.current) return;
    
      try {

        //--------------UNFINISHED MERGING AND SPLITTING CODE----------------
        // let finalBlob = blob;
    
        // // Only attempt merging if we have existing audio
        // if (recordedAudioRef.current.src && recordedBlob.current && recorderWaveSurfer.current) {
          
        //   // Create a copy of the current blob for safety
        //   const currentBlob = recordedBlob.current;
        //   console.log("Current blob size:", currentBlob.size);
        //   console.log("recorded blob size:", blob.size);

        //   console.log("Time started at:", timeStartedAt.current);
        //   console.log("recorder wave surfer duration:", recorderWaveSurfer.current.getDuration());          
          
        //   if (timeStartedAt.current >= recordedAudioRef.current.duration) {
        //     console.log('Appending at end');
        //     finalBlob = await mergeBlobs(currentBlob, blob);
        //   } else if (timeStartedAt.current > 0) {
        //     console.log('Inserting in middle');
        //     const firstPart = sliceAudioBlob(currentBlob, 0, timeStartedAt.current);
        //     const firstMerge = await mergeBlobs(firstPart, blob);
        //     const secondPart = sliceAudioBlob(currentBlob, firstMerge.size, currentBlob.size);

        //     console.log('first merge size:', firstMerge.size);

        //     finalBlob = await mergeBlobs(firstMerge, secondPart);
        //   } else {
        //     console.log('Prepending at beginning');
        //     const remainingPart = sliceAudioBlob(currentBlob, blob.size, currentBlob.size);
        //     finalBlob = await mergeBlobs(blob, remainingPart);
        //   }
        // }
    
        // Update our blob reference FIRST
        recordedBlob.current = blob;
    
        // Clean up previous URL if it exists
        if (recordedAudioRef.current.src) {
          URL.revokeObjectURL(recordedAudioRef.current.src);
        }
    
        // Create new URL
        const newAudioUrl = URL.createObjectURL(blob);
        recordedAudioURL.current = newAudioUrl;
    
        recordedAudioRef.current.currentTime = 0;
    
        // Load the blob into wavesurfer
        await recorderWaveSurfer.current?.loadBlob(blob);
        recorderWaveSurfer.current?.setTime(0);
    
        // Small delay to ensure everything is synced
        await new Promise(resolve => setTimeout(resolve, 50));
    
        // Update state
        setTime(0);
        setPlayable(true);
        setIsPlaying(false);
    
      } catch (error) {
        console.error("Error handling recording:", error);
        setPlayable(false);
        setIsPlaying(false);
      }
    });


    // const sliceAudioBlob = (blob: Blob, start: number, end: number): Blob => {
    //   const duration = recordedAudioRef.current?.duration || 0;
    //   const bytesPerSecond = blob.size / duration;

    //   const endByte = Math.min(Math.floor(end * bytesPerSecond), blob.size);
    //   console.log(`Slicing blob from ${start} to ${endByte} bytes`);
    //   console.log('Blob size:', blob.size);

    //   const slicedBlob = blob.slice(start, endByte);
    //   return slicedBlob;
    // }


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
      setTime(clickRatio * duration);
      console.log(`Seeking to: ${clickRatio * duration}s`);
    });

    recorderWaveSurfer.current.on('finish', () => {
      console.log("Audio ended");
      recordedAudioRef.current?.pause();
      handlePause();
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
      }
    };

  }, [waveformRef, duration, recordedAudioRef])

  // const mergeBlobs = async (blob1: Blob, blob2: Blob): Promise<Blob> => {
  //   // Convert both blobs to ArrayBuffers
  //   const arrayBuffer1 = await blob1.arrayBuffer();
  //   const arrayBuffer2 = await blob2.arrayBuffer();
  
  //   // Concatenate the ArrayBuffers
  //   const combinedArrayBuffer = new Uint8Array(arrayBuffer1.byteLength + arrayBuffer2.byteLength);
  //   combinedArrayBuffer.set(new Uint8Array(arrayBuffer1), 0);
  //   combinedArrayBuffer.set(new Uint8Array(arrayBuffer2), arrayBuffer1.byteLength);
  
  //   // Return a new Blob from the combined ArrayBuffer
  //   return new Blob([combinedArrayBuffer], { type: "audio/wav" });  // Adjust type if needed
  // };

  const toggleRecording = () => {
    if (!recordPluginRef.current) {
      console.log("Record plugin not initialized.");
      return;
    }

    if (!recording) {
      console.log("Starting recording...");
      setTime(0);
      // if(recordedAudioRef.current) {
      //   console.log('started recording at ', recorderWaveSurfer.current?.getCurrentTime())
      // }
      // timeStartedAt.current = (recorderWaveSurfer.current?.getCurrentTime() || 0);
      recordPluginRef.current.startRecording();
      handlePlay();
    } else {
      console.log("Stopping recording...");
      recordPluginRef.current.stopRecording();
      handlePause();
    }

    setRecording(!recording);
  };

  const togglePlayback = () => {
    if (!recorderWaveSurfer.current || !playable || !recordedAudioRef.current) return;
    recorderWaveSurfer.current.playPause();
    console.log("recorder wave surfer time:", recorderWaveSurfer.current.getCurrentTime())
    if(!isPlaying){
      recordedAudioRef.current.src = recordedAudioURL.current || "";
      recordedAudioRef.current.load()

      if(recorderWaveSurfer.current.getCurrentTime() == 0 || time > recorderWaveSurfer.current.getDuration()){
        console.log("Resetting recorded audio time to 0");
        recordedAudioRef.current.currentTime = 0;
        setTime(0);
      }
      recordedAudioRef.current.play();
      handlePlay();
    }
    else{
      handlePause();
      recordedAudioRef.current.pause();
    }
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

  useEffect(() => {
    if(!playing){
      recorderWaveSurfer.current?.pause();
      recordedAudioRef.current?.pause();
      setIsPlaying(false);
    }
  })

  return (
    <div>
      <div className="flex items-center justify-center gap-2">
        <Typography level='h4' sx={{ textAlign: 'center' }}>Recording:</Typography>
        <Typography level="body-xs">Volume: {Math.round(recordedVolume * 100)}%</Typography>
      </div>
      <div className="flex items-center w-[100%] h-[70px] max-w-[80vw]">
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
        <div id="waveform" ref={waveformRef} className="my-4 w-[100%] overflow-auto"></div>
      </div>

      {/* Record Button */}
      <Button onClick={toggleRecording} className="my-4 text-lg"
        sx={(theme) => ({
          color: theme.palette.text.primary,
          background: 'none',
          right: '0',
          top: '0px',
          opacity: 0.5,
          ':hover': {
            background: 'none',
            opacity: 1,
            scale: 1.3,
          },
          transition: 'scale 0.3s ease',
          zIndex: 1000
        })}
      >
        <FontAwesomeIcon
          className={recording ? "text-black" : "text-red-500"}
          icon={recording ? faPause : faCircle}
        />
      </Button>

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

      <audio src={recordedAudioURL.current || undefined} className="hidden" ref={recordedAudioRef} controls/>
    </div>
  );
};

export default WaveformRecorder;
