
import { faArrowLeft, faBars, faExclamationCircle, faMicrophone, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Alert, Box, Button, CircularProgress, Drawer, Dropdown, Link, MenuButton, Modal, Typography} from '@mui/joy'
import React, { useEffect, useRef, useState } from 'react'
import { TermsAndService } from './SmallComponents/TermsAndService'
import { Tracks } from './SmallComponents/Tracks'
import gsap from 'gsap'
import WaveformPlayer from './SmallComponents/WaveformPlayer'
import { LyricDisplay } from './SmallComponents/LyricDisplay'
import { addDoc, collection, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { doc, setDoc, Timestamp } from "firebase/firestore"; 
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util'

type Segment = {
  start: number;
  end: number;
  text: string;
};

type UploadKaraokeParams = {
  title: string;
  lyrics: Segment[];
  date: Date;
  user: string;
}

type UploadKaraoke = {
  title: string;
  lyrics: Segment[];
  date: Date;
  user: string;
  instrumentalRef: string
  vocalRef: string
  id: string;
}

type GeneratePageProps = {
  db: ReturnType<typeof getFirestore>;
  storage: ReturnType<typeof getStorage>;
}

export const GeneratePage: React.FC<GeneratePageProps> = ({db, storage}) => {
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

  const [vocalBlob, setVocalBlob] = useState<Blob | null>(null);
  const [instrumentalBlob, setInstrumentalBlob] = useState<Blob | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userSavedKaraokes = useRef<UploadKaraoke[]>([]);

  const [selectedSavedKaraoke, setSelectedSavedKaraoke] = useState<UploadKaraoke | null>(null);
  
  const ffmpegRef = useRef<FFmpeg | null>(null);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setAccompaniment(`${window.location.origin}/accompaniment.wav`);
  //     setVocal(`${window.location.origin}/vocals.wav`);
  //   };
  //   fetchData().then(() => console.log("Data fetched"));
  // }, []);

  
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

    try{
      const karaokesRef = collection(db, 'SavedKaraokes')
      const auth = getAuth();
      console.log("Current user:", getAuth().currentUser?.uid);
      const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
          const karaokesRef = collection(db, 'SavedKaraokes');
          const q = query(karaokesRef, where('user', '==', user.uid));
          
          const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
            userSavedKaraokes.current = querySnapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                title: data.title,
                lyrics: data.lyrics,
                date: data.date.toDate(), // Assuming Firestore Timestamp
                user: data.user,
                instrumentalRef: data.instrumentalRef,
                vocalRef: data.vocalRef,
              } as UploadKaraoke;
            });
    
            console.log("Current user saved karaokes:", userSavedKaraokes.current);
          });
    
          // Clean up on unmount or user sign-out
          return () => {
            unsubscribeSnapshot();
            setSelectedSavedKaraoke(null);
            userSavedKaraokes.current = [];
          };
        }
      });
      
      return () => {
        unsubscribeAuth(); // Cleanup the listener on component unmount
        setSelectedSavedKaraoke(null); // Reset selected karaoke when component unmounts
        userSavedKaraokes.current = []; // Clear the saved karaokes
      } // Cleanup the listener on component unmount
    }
    catch (error) {
      console.error("Error:", "backend is most likely not running at this time");
      setAlertMessage("Error: " + "backend is most likely not running at this time");
      showAlert();
    }

  }, []);

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    console.log("Uploading file:", file.name);
    setProcessing(true);

    if(file.size > 7 * 1024 * 1024) {
      setAlertMessage("size > 7mb, please upload a smaller file");
      showAlert();
    }

    try{
    const response = await fetch("https://7732-2607-fea8-54e4-ae00-a52a-ed61-1a1a-fcd2.ngrok-free", {
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

  const SaveKaraokeToFirestore = async (karaokeParams: UploadKaraokeParams) => {
    if(!karaokeParams.title || !karaokeParams.lyrics || !karaokeParams.date || !karaokeParams.user) {
      console.error("Missing required karaoke data.");
      return;
    }
    if(!vocal?.includes("firebase") || !accompaniment?.includes("firebase")) {
      if(!vocalBlob){
        console.error("No vocal blob available to upload.");
        return;
      }
      if(!instrumentalBlob){
        console.error("No instrumental blob available to upload.");
        return;
      }
      const vocalsRef = ref(storage, `${karaokeParams.title}/vocals.wav`)

      const instrumentalRef = ref(storage, `${karaokeParams.title}/accompaniment.wav`)
      
      if(ffmpegRef.current === null) { //lazy initialization of ffmpeg
        ffmpegRef.current = new FFmpeg();
        await ffmpegRef.current.load();
        console.log("FFmpeg is loaded");
      }

      (ffmpegRef.current as any).FS('writeFile', 'vocals.wav', await fetchFile(vocalBlob));
      (ffmpegRef.current as any).FS('writeFile', 'accompaniment.wav', await fetchFile(instrumentalBlob));

      const mp3VocalData = (ffmpegRef.current as any).FS('readFile', 'vocals.wav');
      const mp3InstrumentalData = (ffmpegRef.current as any).FS('readFile', 'accompaniment.wav');
      const mp3Blob = new Blob([mp3VocalData.buffer], { type: 'audio/mpeg' });
      const mp3InstrumentalBlob = new Blob([mp3InstrumentalData.buffer], { type: 'audio/mpeg' });
      
      const dataToUpload: UploadKaraoke = {
        title: karaokeParams.title,
        lyrics: karaokeParams.lyrics,
        date: karaokeParams.date,
        user: karaokeParams.user,
        instrumentalRef: instrumentalRef.fullPath,
        vocalRef: vocalsRef.fullPath,
        id: null as any, // Firestore will generate the ID
      }

      console.log("Current user:", getAuth().currentUser?.uid);
      console.log("Attempting to save data:", dataToUpload);

      try{
      
        await Promise.all([
          uploadBytes(vocalsRef, mp3Blob).then(() => {
            console.log('Uploaded vocals to storage');
          }),
          uploadBytes(instrumentalRef, mp3InstrumentalBlob).then(() => {
            console.log('Uploaded accompaniment to storage');
          })
        ]).then(async () => {
          await addDoc(collection(db, 'SavedKaraokes'), dataToUpload).then(() => {
            console.log("Document written with ID: ", karaokeParams.title);
          })
        })
      }
      catch (error) {
        setAlertMessage("Error uploading file to Firestore, Contact Andrewkim09@hotmail.com for help");
        showAlert();
        console.error("Error adding document: ", error);
      }
    }
    else{//means user already saved it so only update lyrics
      try{
      console.log("Updating lyrics for existing karaoke:", selectedSavedKaraoke?.id);
      const karaokeRef = doc(db, 'SavedKaraokes', selectedSavedKaraoke?.id || '');
      await setDoc(karaokeRef, {
        lyrics: karaokeParams.lyrics,
      }, { merge: true }).then(() => {
        console.log("Document updated with ID: ", selectedSavedKaraoke?.id);
      })
      }
      catch (error) {
        console.error("Error updating document: ", error);
      }
    }

  }

  const checkFileType = (file: File) => {
    console.log("Dropped file:", file.name);
    if (file.type !== 'audio/mpeg') {
      showAlert();
      setAlertMessage("Please upload a valid mp3 file");
      return;
    } else {
      uploadFile(file);
    }
  }

  const closeAlert = () => {
    gsap.to(wrongFileNotificationRef.current, {
      opacity: 0,
      transform: 'translateY(-20px)',
      duration: 0.1
    }
    )
  }

  const showAlert = () => {
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

  const onSavedKaraokeClick = (karaoke: UploadKaraoke) => {
    const instrumentalRef = ref(storage, karaoke.instrumentalRef);
    const vocalRef = ref(storage, karaoke.vocalRef);
    setSelectedSavedKaraoke(karaoke);

    getDownloadURL(instrumentalRef).then((url) => {
      console.log("Instrumental URL:", url);
      setAccompaniment(url);
    })

    getDownloadURL(vocalRef).then((url) => {
      console.log("Vocal URL:", url);
      setVocal(url);
    })

    setLyrics(karaoke.lyrics);
  }

  return (
    <Box display='flex' flexDirection={'column'} alignItems={'center'} minHeight={'100vh'} height={'fit-content'}>
      <Button 
        onClick={() => setSidebarOpen(!sidebarOpen)} variant='outlined'
        sx={(theme) => ({
          top: '10px',
          left: '10px',
          position: 'fixed',
          zIndex: 500,
        })}
      >
        <FontAwesomeIcon icon={faBars} className='text-gray-600 hover:text-black' />
      </Button>
      <Drawer open={sidebarOpen} onClose={() => setSidebarOpen(false)} sx={{ zIndex: 1000 }}>
        <div className='flex flex-col gap-2 p-4 w-[100%] h-[100%]'>
          <Typography level='h3' textAlign={'center'}>Saved Karaokes</Typography>
          {userSavedKaraokes.current.map((karaoke, index) => (
            <SavedKarokeItem karaoke={karaoke} key={index} onSavedKaraokeClick={onSavedKaraokeClick} />
          ))}
          <Button  
            variant='soft' 
            color='info'
            onClick={() => {
              setSidebarOpen(false);
              setAccompaniment(null);
              setVocal(null);
              setLyrics(null);
            }}
          >
            + Generate New Karaoke
          </Button>
          <Button onClick={() => setSidebarOpen(false)} variant='soft' color='neutral' sx={(theme) => ({
            color: theme.palette.primary.softColor,
            width: 'fit-content',
            marginTop: 'auto',
          })}>
            <FontAwesomeIcon icon={faArrowLeft} className='mr-2 text-gray-600 hover:text-black' /> Close
          </Button>
        </div>
      </Drawer>
      <Alert
        ref={wrongFileNotificationRef}
        color='danger'
        startDecorator={<FontAwesomeIcon icon={faExclamationCircle} />}
        endDecorator={<button onClick={() => closeAlert()}><FontAwesomeIcon color='gray' icon={faX} /></button>}
        sx={(theme) => ({
          position: 'absolute',
          top: '10px',
          opacity: 0,
        })}
      >
        {alertMessage}
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
          <Link component="button" onClick={handleClose} style={{ cursor: 'pointer', color: 'red', marginTop: 20}} >
            Close
          </Link>
        </Box>
      </Modal>

      {(accompaniment && vocal && lyrics) && <WaveformPlayer SaveKaraokeToFirestore={SaveKaraokeToFirestore} instrumentalFile={accompaniment} vocalFile={vocal} lyrics={lyrics} setVocalBlob={setVocalBlob} setInstrumentalBlob={setInstrumentalBlob} setAlertMessage={setAlertMessage} showAlert={showAlert}/>}
    </Box>
  );
};

function SavedKarokeItem({karaoke, onSavedKaraokeClick}: {karaoke: UploadKaraoke, onSavedKaraokeClick: (karaoke: UploadKaraoke) => void}) {
  return (
    <Button
      onClick={() => {onSavedKaraokeClick(karaoke)}}
      variant='outlined'
      sx={(theme) => ({
        backgroundColor: theme.palette.primary.outlinedActiveBg,
        color: theme.palette.primary.softColor,
        '&:hover': {
          backgroundColor: theme.palette.primary.outlinedColor,
          color: theme.palette.success.solidDisabledBg,
        },
        width: '100%',
      })}
    >
      {karaoke.title}
    </Button>
  )
}


