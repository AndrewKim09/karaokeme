import * as React from 'react';
import { Box, Container, Typography, useColorScheme } from '@mui/joy';
import theme from '../../../theme';

export default function HomePageBlock2() {
  const { mode, setMode } = useColorScheme();

  const items = [
    {
      title: "Get The Exact Instrumentals",
      description: "Generate karaoke of the song you love using the power of Deep Learning",
      image: "https://images.unsplash.com/photo-1483791424735-e9ad0209eea2?auto=format&fit=crop&w=774&q=80"
    },
    {
      title: "High Quality Separation",
      description: "Get clean vocal removal with our advanced AI technology",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1740&q=80"
    },
    {
      title: "Easy to Use",
      description: "Just upload your song and get results in minutes",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1738&q=80"
    },
    {
      title: "Fast Processing",
      description: "Get your results in seconds with our optimized algorithms",
      image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=1740&q=80"
    }
  ];

  return (
    <Box sx={{
      height: 'fit-content',
      paddingBottom: '100px',
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
        maxWidth: '1200px',
        padding: '20px',
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
  return (
    <Box 
      border={'2px solid'} 
      borderColor={'primary.outlinedBorder'}
      boxShadow={'md'}
      borderRadius={'md'}
      sx={{
        width: { xs: '90%', sm: '400px' },
        minHeight: '400px',
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
          width: { xs: '200px', sm: '300px' },
          height: { xs: '200px', sm: '300px' },
          borderRadius: 'md',
          boxShadow: 'xl',
          overflow: 'hidden',
        }}
      >
        <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </Box>
    </Box>
  );
}