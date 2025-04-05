import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Option, Select, Typography } from "@mui/joy";
import { Button } from "@mui/joy";
import {Box} from "@mui/joy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay, faVolumeHigh, faVolumeMute } from "@fortawesome/free-solid-svg-icons";
import { LyricDisplay } from "./LyricDisplay";
import WaveformRecorder from "./WaveformRecorder";
import { VideoGenerator } from "./VideoGenerator";

interface WaveformPlayerProps {
  vocalFile: string;
  instrumentalFile: string;
  lyrics: Segment[]
}

const isValidUrl = (url: string) => {
  try {
    new URL(url, window.location.origin); // Works if URL is valid
    console.log("Valid URL");
    return true;
  } catch (e) {
    return false;
  }
};

const vocalFormWaveSurferOptions = (ref: HTMLElement) => ({
  container: ref,
  waveColor: '#ccc',
  backgroundColor: '#000',
  progressColor: '#0178ff',
  cursorColor: 'transparent',
  response: true,
  height: 40,
  normalize: true,
  backend: "WebAudio" as "WebAudio", // Explicitly type the backend
  barWidth: 2,
  barGap: 3
})

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

const formatTime = (seconds: number) => {
  let date = new Date(0)
  date.setSeconds(seconds)
  return date.toISOString().substr(11, 8)
}

type Segment = {
  start: number;
  end: number;
  text: string;
};

const WaveformPlayer: React.FC<WaveformPlayerProps> = ({ vocalFile, instrumentalFile, lyrics }) => {
  const vocalWaveformRef = useRef<HTMLDivElement>(null);
  const vocalWaveSurfer = useRef<WaveSurfer | null>(null);
  const instrumentalWaveformRef = useRef<HTMLDivElement>(null);
  const instrumentalWaveSurfer = useRef<WaveSurfer | null>(null);
  const instrumentalAudioRef = useRef<HTMLAudioElement>(null);
  const vocalAudioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [vocalVolume, setVocalVolume] = useState(0.5);
  const [vocalMuted, setVocalMuted] = useState(false);
  const [instrumentalVolume, setInstrumentalVolume] = useState(0.5);
  const [instrumentalMuted, setInstrumentalMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [outputDevices, setOutputDevices] = useState<MediaDeviceInfo[]>([]);

  const [vocalOutput, setVocalOutput] = useState<string | null>(null);
  const [instrumentalOutput, setInstrumentalOutput] = useState<string | null>(null);
  

  useEffect(() => {
    const fetchAudioData = async () => {
        if (!vocalFile || !instrumentalFile) return;

        if (!isValidUrl(vocalFile) || !isValidUrl(instrumentalFile)) {
          console.log(vocalFile);
          console.log(instrumentalFile);
          console.log("Invalid URL");
          return;
        }
    }

    fetchAudioData();

    if(!vocalWaveformRef.current || !instrumentalWaveformRef.current) return;
    const vocalOptions = vocalFormWaveSurferOptions(vocalWaveformRef.current);
    const instrumentalOptions = instrumentalWaveSurferOption(instrumentalWaveformRef.current);

    vocalWaveSurfer.current = WaveSurfer.create(vocalOptions);
    instrumentalWaveSurfer.current = WaveSurfer.create(instrumentalOptions);

    vocalWaveSurfer.current.load(vocalFile);
    instrumentalWaveSurfer.current.load(instrumentalFile);

    vocalWaveSurfer.current.on('ready', () => {
      if(!vocalWaveSurfer.current) return;
      vocalWaveSurfer.current.setVolume(0);
      setVocalVolume(.5);
      setDuration(vocalWaveSurfer.current?.getDuration());
    })

    instrumentalWaveSurfer.current.on('ready', () => {
      if(!instrumentalWaveSurfer.current) return;
      instrumentalWaveSurfer.current.setVolume(0);
      setInstrumentalVolume(0.5);
      setDuration(instrumentalWaveSurfer.current?.getDuration());
    })

    vocalWaveSurfer.current.on('audioprocess', () => {
      if(!vocalWaveSurfer.current) return;
      setCurrentTime(vocalWaveSurfer.current?.getCurrentTime());
    })

    instrumentalWaveSurfer.current.on('finish', () => {
      setPlaying(false);
    })

    return () => {
      if (instrumentalWaveSurfer.current && vocalWaveSurfer.current) {
        vocalWaveSurfer.current.destroy();
        instrumentalWaveSurfer.current.destroy();
        vocalWaveSurfer.current = null;
        instrumentalWaveSurfer.current = null;
      }
      if(vocalAudioRef.current) {
        vocalAudioRef.current.src = "";
      }
      if(instrumentalAudioRef.current) {
        instrumentalAudioRef.current.src = "";
      }
    };
  }, [instrumentalFile, vocalFile]);

  useEffect(() => {
    requestPermissions();
  }, [])

  const requestPermissions = async () => {
    try {
      // Request access to any available audio input (e.g., microphone)
      await navigator.mediaDevices.getUserMedia({ audio: true });
  
      // Now we can list the audio output devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioOutputs = devices.filter(device => device.kind === "audiooutput");

      setOutputDevices(audioOutputs);
  
      console.log("Available audio output devices:", audioOutputs);
    } catch (error) {
      console.error("Permission denied or error accessing media devices", error);
    }
  };

  const handlePlayPause = () => {
    
    if(playing){
      handlePause();
    }
    else {
      handlePlay();
    }
  }

  const handlePlay = () => {
    if(!vocalWaveSurfer.current || !instrumentalWaveSurfer.current || !vocalAudioRef.current || !instrumentalAudioRef.current) return;
    vocalAudioRef.current.play();
    instrumentalAudioRef.current.play();
    vocalWaveSurfer.current.play();
    instrumentalWaveSurfer.current.play();
    setPlaying(true);
  }

  const handlePause = () => {
    if(!vocalWaveSurfer.current || !instrumentalWaveSurfer.current || !vocalAudioRef.current || !instrumentalAudioRef.current) return;
    vocalAudioRef.current.pause();
    instrumentalAudioRef.current.pause();
    vocalWaveSurfer.current.pause();
    instrumentalWaveSurfer.current.pause();
    setPlaying(false);
  }

  const handleVocalVolumeChange = (newVolume: number) => {
    if(!vocalAudioRef.current) return;
    setVocalVolume(newVolume);
    vocalAudioRef.current.volume = newVolume;
    setVocalMuted(newVolume === 0)
  }
  
  const handleInstrumentalVolumeChange = (newVolume: number) => {
    if(!instrumentalAudioRef.current) return;
    setInstrumentalVolume(newVolume);
    instrumentalAudioRef.current.volume = newVolume;
    setInstrumentalMuted(newVolume === 0)
  }

  const handleVocalMute = () => {
    if (vocalAudioRef.current) {
      vocalAudioRef.current.volume = vocalMuted ? vocalVolume : 0;
    }
    setVocalMuted(!vocalMuted);
  }

  const handleInstrumentalMute = () => {
    if (instrumentalAudioRef.current) {
      instrumentalAudioRef.current.volume = instrumentalMuted ? instrumentalVolume : 0;
    }
    setInstrumentalMuted(!instrumentalMuted);
  }

  const handleVocalTimeChange = () => {
    if(!vocalWaveSurfer.current || !vocalAudioRef.current || !instrumentalAudioRef.current || !instrumentalWaveSurfer.current) return;
    const newTime = vocalWaveSurfer.current.getCurrentTime();
    vocalAudioRef.current.currentTime = newTime;
    instrumentalAudioRef.current.currentTime = newTime;
    instrumentalWaveSurfer.current.seekTo(newTime / duration)
    setCurrentTime(newTime);
  }

  const handleInstrumentalTimeChange = () => {
    if(!instrumentalWaveSurfer.current || !vocalAudioRef.current || !instrumentalAudioRef.current || !vocalWaveSurfer.current) return;
    const newTime = instrumentalWaveSurfer.current.getCurrentTime();
    vocalAudioRef.current.currentTime = newTime;
    instrumentalAudioRef.current.currentTime = newTime;
    vocalWaveSurfer.current.seekTo(newTime / duration);
    setCurrentTime(newTime);
  }

  const setTime = (time: number) => {
    if(!vocalWaveSurfer.current || !vocalAudioRef.current || !instrumentalAudioRef.current || !instrumentalWaveSurfer.current) return;
    vocalWaveSurfer.current.seekTo(time / duration);
    instrumentalWaveSurfer.current.seekTo(time / duration);
    vocalAudioRef.current.currentTime = time;
    instrumentalAudioRef.current.currentTime = time;
    setCurrentTime(time);
  }

  const changeAudioOutput = (element: HTMLAudioElement, deviceId: string | null) => {
    if (element && deviceId && "setSinkId" in element) {
      (element as any).setSinkId(deviceId).then(() => {
        console.log(`Audio output changed to ${deviceId}`);
      }).catch((err: any) => console.error("Error changing output device:", err));
    }
  };

  useEffect(() => {
    if (vocalAudioRef.current) {
      changeAudioOutput(vocalAudioRef.current, vocalOutput);
    }
    if (instrumentalAudioRef.current) {
      changeAudioOutput(instrumentalAudioRef.current, instrumentalOutput);
    }
  }, [vocalOutput, instrumentalOutput]);
  

  return (
    <Box sx={{ textAlign: "center", width: 'fit-content', }}>

      <LyricDisplay lyrics={lyrics} time={currentTime} setTime={setTime} playing={playing} duration={duration} handlePause={handlePause} handlePlay={handlePlay}/>
      <span>
        {formatTime(currentTime)} <br/>
      </span>

      <div className="flex items-center justify-center gap-2">
      <Button 
        onClick={handlePlayPause} 
        className="h-10 text-xl "
        sx={(theme) => ({
          backgroundColor: theme.palette.primary.outlinedActiveBg,
          color: theme.palette.primary.softColor,
          marginTop: '20px',
          marginBottom: '20px',
          '&:hover': {
            backgroundColor: theme.palette.primary.outlinedColor,
            color: theme.palette.success.solidDisabledBg,
          }
        })}
      >
          <FontAwesomeIcon icon={playing ? faPause : faPlay} />
      </Button>

      {instrumentalFile && lyrics && instrumentalAudioRef.current && 
        <VideoGenerator 
          instrumentalFile={instrumentalFile} 
          lyrics={lyrics} 
          duration={duration}
          />
        }
      </div>

      {/* Waveform Display */}
      <div className="flex items-center justify-center gap-2">
        <Typography level='h4' sx={{ textAlign: 'center' }}>Vocals:</Typography>
        <Typography level="body-xs">Volume: {Math.round(vocalVolume * 100)}%</Typography>
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
            onChange={(e) => handleVocalVolumeChange(parseFloat(e.target.value))}
            value={vocalMuted ? 0 : vocalVolume}
          />
          <button onClick={handleVocalMute}>
            <FontAwesomeIcon icon={!vocalMuted ? faVolumeHigh : faVolumeMute} />
          </button>
        </div>
        
        <div id='vocalWaveform' ref={vocalWaveformRef} style={{ width: '100%'}} onClick={() => {handleVocalTimeChange()}}/>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Typography level='h4' sx={{ textAlign: 'center'}}>Instrumentals</Typography>
        <Typography level="body-xs">Volume: {Math.round(instrumentalVolume * 100)}%</Typography>
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
            onChange={(e) => handleInstrumentalVolumeChange(parseFloat(e.target.value))}
            value={instrumentalMuted ? 0 : instrumentalVolume}
          />
          <button onClick={handleInstrumentalMute}>
            <FontAwesomeIcon icon={!instrumentalMuted ? faVolumeHigh : faVolumeMute} />
          </button>
        </div>
          <div id='instrumentalWaveform' ref={instrumentalWaveformRef} style={{ width: '100%'}} onClick={() => {handleInstrumentalTimeChange()}}/>
      </div>

      
      <div className="flex flex-wrap items-center justify-center gap-2 my-4 w-[100%] max-w-[80vw]">
        <div className="flex items-center gap-2">
          <Typography 
            className="font-bold" 
            textColor="text.secondary"
            display={"inline"}
          >
            Vocal Output:
          </Typography>
          <Select onChange={(e, value : string | null) => setVocalOutput(value)} className="w-20 cursor-pointer">
            {outputDevices.map((device) => (
              <Option key={device.deviceId} value={device.deviceId}>{device.label}</Option>
            ))}
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Typography 
            className="font-bold"
            textColor={"text.secondary"}
            display={"inline"}
          >
            Instrumental Output:
          </Typography>
          <Select onChange={(e, value: string | null) => setInstrumentalOutput(value)} className="w-20 cursor-pointer">
            {outputDevices.map((device) => (
              <Option key={device.deviceId} value={device.deviceId} >{device.label}</Option>
            ))}
          </Select>
        </div>
      </div>

      {<WaveformRecorder setTime={setTime} handlePlay={handlePlay} handlePause={handlePause} duration={duration} time={currentTime} playing={playing}/>}

      <audio id='vocalAudio' ref={vocalAudioRef} src={vocalFile} controls style={{ display: 'none' }} />
      <audio id='instrumentalAudio' ref={instrumentalAudioRef} src={instrumentalFile} controls style={{ display: 'none' }} />

    </Box>
  );
};

export default WaveformPlayer;
