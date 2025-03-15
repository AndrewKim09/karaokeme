import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Container from '@mui/material/Container';
import Typography, { typographyClasses } from '@mui/joy/Typography';
import { Grid } from '@mui/joy';
import theme from '../../theme';

export default function StackedBoxesLayout({
  children,
}: React.PropsWithChildren<{ reversed?: boolean }>) {
  return (
    <Container
      sx={{

          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          py: 5,
          gap: 4,
          flexDirection: 'column',
          alignContent: 'center',
          width: '100%',
          "&.MuiContainer-maxWidthMd": {
            maxWidth: "1600px",
          },
          [theme.breakpoints.up(1536)]: {
            justifyContent: 'center',
          }
    
      }}
      maxWidth={'md'}
    > 
      <Typography
        level="h1"
        sx={{
          fontWeight: 'xl',
          fontSize: 'clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)',
        }}
      >
        Features
      </Typography>
    <Grid 
      container  justifyContent='space-between' alignItems={'stretch'} justifyItems={'stretch'} width={'100%'} pb={'50px'} height={'1500px'} 
      sx={(theme) => ({
        alignItems: 'center',
        [theme.breakpoints.up(430)]: {
          height: '80%',
          pb: 0,
          gap: 10,
        },
        [theme.breakpoints.up(1536)]: {
          justifyContent: 'center',
        }
      })}
    >
      {children}
    </Grid>
    </Container>
  );
}
