import { Box, Typography, useColorScheme } from '@mui/joy';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft, faEdit, faX } from '@fortawesome/free-solid-svg-icons';

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

export const LyricDisplay: React.FC<LyricDisplayProps> = ({ lyrics, time, setTime }) => {
  const [editedLyrics, setEditedLyrics] = useState<Segment[]>(lyrics);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempText, setTempText] = useState<string>("");

  const lyricsContainerRef = React.useRef<HTMLDivElement>(null);

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

  return (
    <Box
      ref={lyricsContainerRef}
      sx={(theme) => ({
        overflow: 'visible',
        overflowY: 'scroll',
        marginTop: '20px',
        padding: '10px',
        backgroundColor: theme.palette.background.level1,
        borderRadius: '10px',
        maxWidth: '800px',
        width: '80vw',
        height: '40vh',
      })}
    >
      {editedLyrics.map((line, index) => (
        <div 
          className='w-[100%] flex justify-end'
          onClick={() => setTime(line.start)}
          onMouseEnter={(e) => showTools(e)}
          onMouseLeave={(e) => hideTools(e)}
        >
          <Typography
            key={index}
            sx={(theme) => ({
              padding: '5px',
              fontSize: '25px',
              fontWeight: currentLineIndex === index ? 'bold' : 'normal',
              width: '90%',
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
                  {line.start.toFixed(2)}s
                </Typography>
                -
                <Typography>
                  {line.end.toFixed(2)}s
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
          </Typography>
        </div>
      ))}
    </Box>
  );
};
