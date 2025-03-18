import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Box, Typography } from "@mui/material";
import { Button } from "@mui/joy";

interface WaveformPlayerProps {
  file: string;
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

const WaveformPlayer: React.FC<WaveformPlayerProps> = ({ file }) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const [wavesurfer, setWaveSurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!waveformRef.current || !file) return;

    // Only create a new WaveSurfer instance if one doesn't already exist
    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#4caf50",
      progressColor: "#ff5722",
      cursorColor: "#ffeb3b",
      height: 100,
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
    });

    if (!isValidUrl(file)) {
      console.log(file);
      console.log("Invalid URL");
      return;
    }

    // Load the file into WaveSurfer and handle any errors
    ws.load(file);

    ws.on("ready", () => {
      setIsReady(true);
      console.log("WaveSurfer is ready!");
    });

    ws.on("error", (error) => {
      console.log("Error loading file:", error);
    });

    setWaveSurfer(ws);

    // Cleanup function to destroy WaveSurfer on component unmount or file change
    return () => {
      if (isReady) {
        ws.destroy();
      }
    };
  }, [file]); // Re-run the effect if the file changes

  const togglePlay = () => {
    if (!wavesurfer) return;
    wavesurfer.playPause();
    setIsPlaying(wavesurfer.isPlaying());
  };

  return (
    <Box sx={{ textAlign: "center", maxWidth: 600, margin: "auto" }}>
      <Typography variant="h6" gutterBottom>MP3 Waveform Player</Typography>

      {/* Waveform Display */}
      <Box ref={waveformRef} sx={{ mt: 2, border: "1px solid gray", borderRadius: "5px" }} />

      {/* Play/Pause Button */}
      {file && (
        <Button onClick={togglePlay} sx={{ mt: 2 }}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
      )}
    </Box>
  );
};

export default WaveformPlayer;
