
import { faExclamationCircle, faMicrophone, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Alert, Box, CircularProgress, Dropdown, Link, MenuButton, Modal, Typography} from '@mui/joy'
import React, { useEffect, useRef, useState } from 'react'
import { TermsAndService } from './SmallComponents/TermsAndService'
import { Tracks } from './SmallComponents/Tracks'
import gsap from 'gsap'
import WaveformPlayer from './SmallComponents/WaveformPlayer'
import { LyricDisplay } from './SmallComponents/LyricDisplay'

type Segment = {
  start: number;
  end: number;
  text: string;
};

export const GeneratePage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wrongFileNotificationRef = useRef<HTMLDivElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const [tracks, setTracks] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const [lyrics, setLyrics] = useState<Segment[] | null>([
    {
        "end": 15,
        "start": 0,
        "text": " If you ever leave me baby Leave some morphine at my door"
    },
    {
        "end": 29,
        "start": 16,
        "text": " Cause it would take a whole lot of medication To realize what we used to have, we don't have it anymore"
    },
    {
        "end": 41,
        "start": 29,
        "text": " There's no religion that could save me No matter how long my knees are on the floor"
    },
    {
        "end": 50,
        "start": 41,
        "text": " So keep in mind all the sacrifices I've made Yeah, I'll keep you by my side"
    },
    {
        "end": 57,
        "start": 50,
        "text": " And keep this moth walking out the door Cause there'll be no sunlight"
    },
    {
        "end": 64,
        "start": 57,
        "text": " If I lose you baby There'll be no clear skies"
    },
    {
        "end": 70,
        "start": 64,
        "text": " If I lose you baby Just let the clouds fly"
    },
    {
        "end": 75,
        "start": 70,
        "text": " I will do the same If you walk away"
    },
    {
        "end": 84,
        "start": 75,
        "text": " Every day it'll rain Rain, rain"
    },
    {
        "end": 107,
        "start": 95,
        "text": " I'll never be your mother's baby Your daddy can't even look me in the eye"
    },
    {
        "end": 115,
        "start": 107,
        "text": " If I was in their shoes I'd be doing the same thing"
    },
    {
        "end": 121,
        "start": 115,
        "text": " Said there goes my little girl Walking with that troublesome guy"
    },
    {
        "end": 127,
        "start": 121,
        "text": " But they're just a funny little something they can't understand"
    },
    {
        "end": 133,
        "start": 127,
        "text": " Ooh, my little ball in a wash may change their minds"
    },
    {
        "end": 139,
        "start": 133,
        "text": " Yeah, but you know I'll try, I'll try, I'll try, I'll try"
    },
    {
        "end": 147,
        "start": 140,
        "text": " I'll make up these broken pieces till I'm bleeding If that'll make it right"
    },
    {
        "end": 154,
        "start": 147,
        "text": " Cause there'll be no sunlight If I lose you baby"
    },
    {
        "end": 160,
        "start": 154,
        "text": " There'll be no clear skies If I lose you baby"
    },
    {
        "end": 168,
        "start": 160,
        "text": " Just let the clouds fly I will do the same If you walk away"
    },
    {
        "end": 176,
        "start": 168,
        "text": " Every day it'll rain Rain, rain"
    },
    {
        "end": 193,
        "start": 176,
        "text": " Ooh, ooh, ooh, ooh Oh, won't you say goodbye"
    },
    {
        "end": 199,
        "start": 193,
        "text": " Won't you say goodbye"
    },
    {
        "end": 205,
        "start": 199,
        "text": " I'll break up this broken piece until I'm bleeding"
    },
    {
        "end": 208,
        "start": 205,
        "text": " If that'll make it right"
    },
    {
        "end": 211,
        "start": 208,
        "text": " There'll be no sunlight"
    },
    {
        "end": 214,
        "start": 211,
        "text": " If I was your baby"
    },
    {
        "end": 218,
        "start": 214,
        "text": " Then there'll be no clear skies"
    },
    {
        "end": 221,
        "start": 218,
        "text": " If I was your baby"
    },
    {
        "end": 226,
        "start": 221,
        "text": " And just like the clouds my eyes will do the same"
    },
    {
        "end": 229,
        "start": 226,
        "text": " If you walk away"
    },
    {
        "end": 237,
        "start": 229,
        "text": " Every day it'll rain, rain, rain"
    },
]);
  const [accompaniment, setAccompaniment] = useState<string | null>(null);
  const [vocal, setVocal] = useState<string | null>(null);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setAccompaniment(`${window.location.origin}/accompaniment.wav`);
  //     setVocal(`${window.location.origin}/vocals.wav`);
  //   };
  //   fetchData().then(() => console.log("Data fetched"));
  // }, []);


  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    console.log("Uploading file:", file.name);
    setProcessing(true);

    try{
    const response = await fetch("http://localhost:5000/separate", {
      method: "POST",
      body: formData,
    }).finally(() => setProcessing(false))

    const result = await response.json().then(async (data) => {
      console.log(data);
      setAccompaniment(data.instrumental);
      setVocal(data.vocals);
      setLyrics(data.lyrics);
    })
  }
    catch (error) {
      console.error("Error uploading file:", error);
      setProcessing(false);
    }
  }

  const checkFileType = (file: File) => {
    console.log("Dropped file:", file.name);
    if (file.type !== 'audio/mpeg') {
      showWrongFileNotification();
      console.log('Please upload an audio file');
      return;
    } else {
      uploadFile(file);
    }
  }

  const closeWrongFileNotification = () => {
    gsap.to(wrongFileNotificationRef.current, {
      opacity: 0,
      transform: 'translateY(-20px)',
      duration: 0.1
    }
    )
  }

  const showWrongFileNotification = () => {
    gsap.fromTo(wrongFileNotificationRef.current, {
      opacity: 0,
      transform: 'translateY(-20px)',
      visibility: 'visible'
    }, {
      opacity: 1,
      transform: 'translateY(0)',
      duration: 0.5
    });
  }

  useEffect(() => {
    const dropArea = document.getElementById('dropArea');
    if (dropArea) {
      dropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropArea.classList.add('dragover');
      });

      dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('dragover');
      });

      dropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        dropArea.classList.remove('dragover');
        const file = event.dataTransfer?.files?.[0];
        if (file) checkFileType(file);
      });
    }
  }, []);

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the input
      fileInputRef.current.click(); // Opens file picker
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file
    if (file) {
      console.log("Selected file:", file.name);
      checkFileType(file);
    }
  };

  return (
    <Box display='flex' flexDirection={'column'} alignItems={'center'} minHeight={'100vh'} height={'fit-content'}>
      <Alert
        ref={wrongFileNotificationRef}
        color='danger'
        startDecorator={<FontAwesomeIcon icon={faExclamationCircle} />}
        endDecorator={<button onClick={() => closeWrongFileNotification()}><FontAwesomeIcon color='gray' icon={faX} /></button>}
        sx={(theme) => ({
          position: 'absolute',
          top: '10px',
          left: '10px',
          opacity: 0,
        })}
      >
        Please upload an audio file
      </Alert>
      <Typography level='h1' marginTop={'50px'}>Generate <FontAwesomeIcon className='text-yellow-300' icon={faMicrophone} /></Typography>

      {!(accompaniment && vocal && lyrics) && 
        <Box
          display='flex'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          border={'2px dashed'}
          borderColor={'neutral.plainColor'}
          p={4} marginTop={4} minWidth={'300px'}
          width={'fit-content'}
          borderRadius={'md'}
          id='dropArea'
        >
          {!processing && <>
          <Dropdown >
            <MenuButton
              sx={(theme) => ({
                backgroundColor: theme.palette.primary.outlinedActiveBg,
                color: theme.palette.primary.softColor,
                '&:hover': {
                  backgroundColor: theme.palette.primary.outlinedColor,
                  color: theme.palette.success.solidDisabledBg,
                }
              })}
              onClick={() => handleFileSelect()}
            >Upload a file
            </MenuButton>
          </Dropdown>
          <Typography level='body-xs' marginTop={'10px'}>Optionally drag the file into the box</Typography>
          <Typography level='body-xs' marginTop={'10px'}>Supported file types: mp3</Typography>
          
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          /> 
          </>}

          {processing && 
            <Typography
              sx={(theme) => ({
                display: 'flex',
                alignItems: 'center',
              })}
            >
              <CircularProgress sx={{marginRight: '20px'}}/> Generating Track
            </Typography>
          }
          </Box>
      }

      <Tracks tracks={tracks} />

      {!(accompaniment && vocal && lyrics) && <Typography level='body-xs' marginTop={'10px'}>By uploading a file you agree to these <Link onClick={handleOpen}>Terms And Conditions </Link></Typography>}
      <Modal open={openModal} onClose={handleClose}>
        <Box
          sx={(theme) => ({
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80vw',
            bgcolor: theme.palette.background.level1,
            padding: 2,
            boxShadow: 24,
            borderRadius: 1,
            overflow: 'scroll',
            height: '80vh',
          })}
        >
          <TermsAndService />
          <Link component="button" onClick={handleClose} style={{ cursor: 'pointer', color: 'red', marginTop: 20 }} >
            Close
          </Link>
        </Box>
      </Modal>

      {(accompaniment && vocal && lyrics) && <WaveformPlayer instrumentalFile={accompaniment} vocalFile={vocal} lyrics={lyrics}/>}
    </Box>
  );
};