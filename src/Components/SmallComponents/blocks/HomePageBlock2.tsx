import * as React from 'react';
import { Box, Container, Typography, useColorScheme } from '@mui/joy';
import theme from '../../../theme';

export default function HomePageBlock2() {
  const { mode, setMode } = useColorScheme();

  const items = [
    {
      title: "Get The Exact Instrumentals",
      description: "Generate karaoke of the song you love using the power of Deep Learning",
      image: "instruments.svg"
    },
    {
      title: "Customizable",
      description: "edit the lyrics and titles of the songs you upload",
      image: "/customize.svg"
    },
    {
      title: "Generate videos",
      description: "Want to save the karaoke video? use the download tool to save the video as an mp4",
      image: "/mp4Download.png"
    },
    {
      title: "Save them to an account",
      description: "Save your generated videos to your account and access them from anywhere (implemented with Firebase/Firestore)",
      image: "/firestore.svg"
    },
    {
      title: "Record your own voice",
      description: "Record your own voice over the karaoke video and save it to your account",
      image: "recording-symbol.svg"
    }
  ];

  return (
    <Box sx={{
      height: 'fit-content',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Typography level='h1' textAlign='center' sx={{ fontSize: { xs: '2rem', sm: '3rem' } }}>
        Features
      </Typography>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 4,
        padding: '20px',
        width: '100%',
        height:'80%'
      }}>
        {items.map((item, index) => (
          <CardItem key={index} title={item.title} description={item.description} image={item.image} />
        ))}
      </Box>
    </Box>
  );
}

interface CardItemProps {
  title: string;
  description: string;
  image: string;
}

function CardItem({ title, description, image }: CardItemProps) {
  const { mode } = useColorScheme();  // Get the current mode

  // Define stroke color based on mode
  const svgColor = mode === 'dark' ? '#FFFFFF' : '#000000'; 

  return (
    <Box 
      border={'2px solid'} 
      borderColor={'primary.outlinedBorder'}
      boxShadow={'md'}
      borderRadius={'md'}
      sx={{
        width: { xs: '90%', sm: '400px' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 3,
        textAlign: 'center'
      }}
    >
      <Typography level="h2" sx={{ mb: 1 }}>{title}</Typography>
      <Typography sx={{ mb: 2 }}>{description}</Typography>
      <Box
        sx={{
          aspectRatio: '1/1',
          height: { xs: '150px', sm: '200px' },
          borderRadius: 'md',
          overflow: 'hidden',
        }}
      >
        {image.endsWith('.svg') ? (
          <img
            src={image}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: mode === 'dark' ? 'invert(100%)' : 'none', // Invert color for dark mode
            }}
          />
        ) : (
          <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', }} />
        )}
      </Box>
    </Box>
  );
}