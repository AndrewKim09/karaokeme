import { faMicrophone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Dropdown, Link, MenuButton, Modal, Typography } from '@mui/joy'
import React, { useEffect, useRef, useState } from 'react'

export const GeneratePage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);


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
        if (file) {
          console.log("Dropped file:", file.name);
          if(file.type !== 'audio/mpeg') {
            console.log('Please upload an audio file');
            return;
          }
          // You can handle file upload logic here
        }
      });
    }
  }, []);

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Opens file picker
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file
    if (file) {
      console.log("Selected file:", file.name);
      // You can handle file upload logic here
    }
  };
  return (
    <Box display='flex' flexDirection={'column'} alignItems={'center'}>
      <Typography level='h1' marginTop={'50px'}>Generate <FontAwesomeIcon className='text-yellow-300' icon={faMicrophone}/></Typography>

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
            onClick={handleFileSelect}
          >Upload a file
          </MenuButton>
        </Dropdown>
        <Typography level='body-xs' marginTop={'10px'}>Optionally drag the file into the box</Typography>
        <Typography level='body-xs' marginTop={'10px'}>Supported file types: mp3</Typography>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Box>
      <Typography level='body-xs' marginTop={'10px'}>By uploading a file you agree to these <Link onClick={handleOpen}>Terms And Conditions </Link></Typography>

      <Modal open={openModal} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            padding: 2,
            boxShadow: 24,
            borderRadius: 1,
          }}
        >
          <Typography level='h4' component="h2">
            This is a modal!
          </Typography>
          <Link component="button" onClick={handleClose} style={{ cursor: 'pointer', color: 'red', marginTop: 20 }}>
            Close Modal
          </Link>
        </Box>
      </Modal>
    </Box>
  )
}
