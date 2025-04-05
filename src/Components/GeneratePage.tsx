
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

  const [lyrics, setLyrics] = useState<Segment[] | null>();
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

    if(file.size > 7 * 1024 * 1024) {
      showWrongFileNotification();
    }

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
      console.log('Please upload an audio file that is under 7mb');
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
            <div className='flex flex-col items-center justify-center gap-2'>
              <CircularProgress sx={{marginRight: '20px'}}/> <Typography> Generating Track </Typography>
              <Typography level='body-xs'>
                it can take around a minute for a 6mb file
              </Typography>
              <Typography level='body-xs' flexWrap={'wrap'} textAlign={'center'}>
                audio that isnt clear will be separated properly but will not have correct lyrics
              </Typography>
            </div>
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