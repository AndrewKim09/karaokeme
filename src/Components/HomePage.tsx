import { Box, useColorScheme } from '@mui/joy';
import React from 'react'
import HomePageBlock1 from './SmallComponents/blocks/HomePageBlock1';

export const HomePage = () => {
  const {mode, setMode} = useColorScheme();
  return (
    <Box
      className ='h-[100vh] overflow-y-scroll'
      sx={{
        scrollSnapType: 'y mandatory',
        '& > div': {
          scrollSnapAlign: 'start',
        },
      }}
    >
      <HomePageBlock1/>
    </Box>
  )
}
