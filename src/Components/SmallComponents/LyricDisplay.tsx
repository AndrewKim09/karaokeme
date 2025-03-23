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
};

export const LyricDisplay: React.FC<LyricDisplayProps> = ({lyrics, time}) => {
  const lyricsContainerRef = React.useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(time);


  // Find the current lyric line based on time
  const currentLineIndex = lyrics.findIndex(
    (line) => time >= line.start && time <= line.end
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
            })}
          >
            {line.text}
          </Typography>
        ))}
    </Box>
  )
}
