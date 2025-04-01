import { Box, Button, Typography, useColorScheme } from '@mui/joy';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft, faEdit, faExpand, faPause, faPlay, faX } from '@fortawesome/free-solid-svg-icons';
import theme from '../../theme';
import { Repeat } from '@mui/icons-material';
import { duration } from '@mui/material';

type Segment = {
  start: number;
  end: number;
  text: string;
};

type LyricDisplayProps = {
  lyrics: Segment[];
  time: number;
  setTime: (time: number) => void;
  playing: boolean;
  duration: number;
  handlePlay: () => void;
  handlePause: () => void;
};

export const LyricDisplay: React.FC<LyricDisplayProps> = ({ lyrics, time, setTime, playing, duration , handlePlay, handlePause}) => {
  const [editedLyrics, setEditedLyrics] = useState<Segment[]>(lyrics);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempText, setTempText] = useState<string>("");

  const lyricsContainerRef = React.useRef<HTMLDivElement>(null);

  const [expanded, setExpanded] = useState(false);

  const mode = useColorScheme();

  // Find the current lyric line based on time
  const currentLineIndex = lyrics.findIndex(
    (line) => time + 0.25 >= line.start && time + 0.25 <= line.end
  );

  useEffect(() => {
    if (lyricsContainerRef.current) {
      const activeLine = lyricsContainerRef.current.children[currentLineIndex] as HTMLDivElement;
      if (activeLine) {
        activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentLineIndex]);

  const showTools = (e: React.MouseEvent) => {
    const tools = e.currentTarget.querySelector('#tools') as HTMLDivElement;
    if (tools) {
      tools.style.opacity = '1';
    }
  };

  const hideTools = (e: React.MouseEvent) => {
    const tools = e.currentTarget.querySelector('#tools') as HTMLDivElement;
    if (tools) {
      tools.style.opacity = '0';
    }
  };

  const onEdit = (index: number, text: string) => {
    setEditingIndex(index);
    setTempText(text);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTempText(e.target.value);
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      const updatedLyrics = [...editedLyrics];
      updatedLyrics[editingIndex].text = tempText;
      setEditedLyrics(updatedLyrics);
      setEditingIndex(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    }
  };

  const onDelete = (index: number) => {
    const updatedLyrics = editedLyrics.filter((_, i) => i !== index);
    setEditedLyrics(updatedLyrics);
  }

  const handlePlayPause = () => {
    if(playing) {
      handlePause();
    }
    else {
      handlePlay();
    }
  }

  return (
    <Box
      ref={lyricsContainerRef}
      sx={(theme) => ({
        overflow: 'visible',
        overflowY: 'scroll',
        marginTop: expanded ? '0' : '20px',
        padding: expanded ? '0' : '10px',
        backgroundColor: theme.palette.background.level1,
        borderRadius: '10px',
        maxWidth: expanded? 'auto' : '800px',
        width: expanded? 'auto': '80vw',
        height: expanded? 'auto' : '40vh',
        position: expanded ? 'fixed' : 'relative',
        top: expanded ? '0' : 'auto',
        left: expanded ? '0' : 'auto',
        bottom: expanded ? '0' : 'auto',
        right: expanded ? '0' : 'auto',
        zIndex: expanded ? 500 : 'auto',
        scrollbarColor: `${theme.palette.primary.plainColor} ${theme.palette.background.level1}`,
      })}
    >
      <Box className='sticky top-0 z-50 flex'
        sx={(theme) => ({
          justifyItems: expanded ? 'start' : 'end',
        })}
      >
        <Button
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
          onClick={() => setExpanded(!expanded)}
        >
          <FontAwesomeIcon icon={faExpand}/>
        </Button>
      </Box>

      {editedLyrics.map((line, index) => (
        <div 
          className='w-[100%] flex justify-end relative'
          onClick={() => setTime(line.start)}
          onMouseEnter={(e) => showTools(e)}
          onMouseLeave={(e) => hideTools(e)}
          key={index}
        >
          <Box
            key={index}
            sx={(theme) => ({
              padding: '5px',
              fontSize: '25px',
              // fontWeight: currentLineIndex === index ? 'bold' : 'normal',
              width: expanded ? '100%' : '90%',
              color:
                currentLineIndex === index
                  ? theme.palette.primary.plainColor
                  : theme.palette.text.primary,
              position: 'relative',
              cursor: 'pointer',
              ':hover': {
                opacity: 0.7,
              },
            })}
          >
            <div id='tools' className='absolute top-0 left-[-40px] flex items-center justify-center gap-2 opacity-0'>
              <div className='flex items-center justify-between h-[100%] absolute z-40 top-[80%] text-xs sm:invisible md:visible'> 
                <Typography>
                  {line.start.toFixed(0)}s
                </Typography>
                -
                <Typography>
                  {line.end.toFixed(0)}s
                </Typography>
              </div>

              <button className='text-sm' onClick={(e) => {
                e.stopPropagation(); // Prevent triggering parent click event
                onEdit(index, line.text);
              }}>
                <FontAwesomeIcon
                  icon={faEdit}
                  className={`none ${
                    mode.colorScheme === 'light' ? 'text-gray-600 hover:text-black' : 'text-gray-600 hover:text-white'
                  }`}
                />
              </button>

              <button>
                <FontAwesomeIcon icon={faX} onClick={() => {onDelete(index)}} className='text-red-400 text-md hover:text-red-600'/>
              </button>
            </div>

            {editingIndex === index ? (
              <textarea
                value={tempText}
                onChange={handleInputChange}
                onBlur={saveEdit}
                onKeyDown={handleKeyDown}
                autoFocus
                className="bg-transparent border-b border-gray-500 outline-none w-[100%] text-center"
              />
            ) : (
              line.text
            )}
          </Box>
        </div>
      ))}

      <div className='h-[140px]'></div>
      <Box
        sx={(theme) => ({
          position: 'fixed',
          bottom: '0',
          display: expanded ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'fit-content',
          padding: '10px',
          zIndex: 1000,
          background: theme.palette.background.level2,
          width: '100%',
          flexDirection: 'column'
        })}
      >
        <Box 
          className='w-[100%] flex gap-4 justify-center'
          sx={(theme) => ({
            color: theme.palette.text.primary,
          })}
        >
          <span>
          {(time / 60).toFixed(0)}:{(time % 60) < 10 ? '0' : ''}{(time % 60).toFixed(0)}
          </span>

          <input
            className='w-[80%]'
            type='range'
            id='volume'
            name='volume'
            min='0'
            max='1'
            step='0.005'
            value={time / duration}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const newTime = e.target.valueAsNumber * duration;
              setTime(newTime);
            }}
          />

          <span>
            {(duration / 60).toFixed(0)}:{(duration % 60) < 10 ? '0' : ''}{(duration % 60).toFixed(0)}
          </span>
        </Box>

        <Button sx={(theme) => ({
          background: 'none',
          hover: {
            background: 'none',
          },
          color: theme.palette.text.primary,
            
          })}
          onClick={handlePlayPause}
        >
          <FontAwesomeIcon icon={playing ? faPause : faPlay} className='text-gray-600 hover:text-black'/>
        </Button>
      </Box>
    </Box>
  );
};
