import { Box, Typography } from '@mui/joy';
import React, { useEffect, useState } from 'react'
import theme from '../../theme';

type Segment = {
  start: number;
  end: number;
  text: string;
};

type LyricDisplayProps = {
  lyrics: Segment[];
  time: number;
  setTime: (time: number) => void;
};

export const LyricDisplay: React.FC<LyricDisplayProps> = ({lyrics, time, setTime}) => {
  const lyricsContainerRef = React.useRef<HTMLDivElement>(null);


  // Find the current lyric line based on time
  const currentLineIndex = lyrics.findIndex(
    (line) => (time + .25) >= line.start && (time + .25) <= line.end
  );

  useEffect(() => {
    if (lyricsContainerRef.current) {
      const activeLine = lyricsContainerRef.current.children[currentLineIndex] as HTMLDivElement;
      if (activeLine) {
        activeLine.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentLineIndex]);



  return (
    <Box
      ref={lyricsContainerRef}
      sx={(theme) => ({
        overflowY: 'auto',
        marginTop: '20px',
        padding: "10px",
        backgroundColor: theme.palette.background.level1,
        borderRadius: '10px',
        maxWidth: '800px',
        width: '80vw',
        height: '40vh',
      })}
    >
        {lyrics.map((line, index) => (
          <Typography
            key={index}
            sx={(theme) => ({
              padding: "5px",
              fontSize: "25px",
              fontWeight: currentLineIndex === index ? "bold" : "normal",
              color: currentLineIndex === index ? theme.palette.primary.plainColor : theme.palette.text.primary,
              cursor: "pointer",
              ":hover": {
                opacity: .7
              }
            })}
            onClick={() => setTime(line.start)}
          >
            {line.text}
          </Typography>
        ))}
    </Box>
  )
}
