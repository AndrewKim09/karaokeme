import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Typography } from "@mui/material";
import { Button } from "@mui/joy";
import {Box} from "@mui/joy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay, faVolumeDown, faVolumeHigh, faVolumeMute, faVolumeOff } from "@fortawesome/free-solid-svg-icons";
import { FormatListNumbered } from "@mui/icons-material";
import theme from "../../theme";
import { LyricDisplay } from "./LyricDisplay";

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

const instrumentalWaveSurgerOption = (ref: HTMLElement) => ({
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
  const [loaded, setLoaded] = useState(false);

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
    const instrumentalOptions = instrumentalWaveSurgerOption(instrumentalWaveformRef.current);

    vocalWaveSurfer.current = WaveSurfer.create(vocalOptions);
    instrumentalWaveSurfer.current = WaveSurfer.create(instrumentalOptions);

    vocalWaveSurfer.current.load(vocalFile);
    instrumentalWaveSurfer.current.load(instrumentalFile);

    vocalWaveSurfer.current.on('ready', () => {
      if(!vocalWaveSurfer.current) return;
      vocalWaveSurfer.current.setVolume(0);
      setVocalVolume(.5);
      setDuration(vocalWaveSurfer.current?.getDuration());
      setLoaded(true)
    })

    instrumentalWaveSurfer.current.on('ready', () => {
      if(!instrumentalWaveSurfer.current) return;
      instrumentalWaveSurfer.current.setVolume(0);
      setInstrumentalVolume(0.5);
      setDuration(instrumentalWaveSurfer.current?.getDuration());
      setLoaded(true)
    })

    vocalWaveSurfer.current.on('audioprocess', () => {
      if(!vocalWaveSurfer.current) return;
      setCurrentTime(vocalWaveSurfer.current?.getCurrentTime());
    })
    

    return () => {
      if (instrumentalWaveSurfer.current && vocalWaveSurfer.current) {
        vocalWaveSurfer.current.destroy();
        instrumentalWaveSurfer.current.destroy();
        vocalWaveSurfer.current = null;
        instrumentalWaveSurfer.current = null;
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
    if(!vocalWaveSurfer.current || !instrumentalWaveSurfer.current || !vocalAudioRef.current || !instrumentalAudioRef.current) return;
    vocalWaveSurfer.current.playPause();
    instrumentalWaveSurfer.current.playPause();
    if(playing) {
      vocalAudioRef.current.pause();
      instrumentalAudioRef.current.pause();
    }
    else{
      vocalAudioRef.current.play();
      instrumentalAudioRef.current.play();
    }
    setPlaying(!playing);
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

      <LyricDisplay lyrics={lyrics} time={currentTime} setTime={setTime}/>

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

      {/* Waveform Display */}
      <div className="flex items-center justify-center gap-2">
        <Typography variant='h4' sx={{ textAlign: 'center' }}>Vocals:</Typography>
        <span className="text-xs">Volume: {Math.round(vocalVolume * 100)}%</span>
      </div>
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
        <Typography variant='h4' sx={{ textAlign: 'center'}}>Instrumentals</Typography>
        <span className="text-xs">Volume: {Math.round(vocalVolume * 100)}%</span>
      </div>

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
            onChange={(e) => handleInstrumentalVolumeChange(parseFloat(e.target.value))}
            value={instrumentalMuted ? 0 : instrumentalVolume}
          />
          <button onClick={handleInstrumentalMute}>
            <FontAwesomeIcon icon={!instrumentalMuted ? faVolumeHigh : faVolumeMute} />
          </button>
        </div>
          <div id='instrumentalWaveform' ref={instrumentalWaveformRef} style={{ width: '100%'}} onClick={() => {handleInstrumentalTimeChange()}}/>
      </div>

      <span>
        {formatTime(currentTime)} <br/>
      </span>

      <audio id='vocalAudio' ref={vocalAudioRef} src={vocalFile} controls style={{ display: 'none' }} />
      <audio id='instrumentalAudio' ref={instrumentalAudioRef} src={instrumentalFile} controls style={{ display: 'none' }} />

      <label className="mr-2 font-bold">Vocal Output:</label>
      <select onChange={(e) => setVocalOutput(e.target.value)} className="w-20">
        {outputDevices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>{device.label}</option>
        ))}
      </select>

      <label className="mr-2 font-bold">Instrumental Output:</label>
      <select onChange={(e) => setInstrumentalOutput(e.target.value)} className="w-20">
        {outputDevices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>{device.label}</option>
        ))}
      </select>
    </Box>
  );
};

export default WaveformPlayer;
