import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Container from '@mui/joy/Container';
import Typography, { typographyClasses } from '@mui/joy/Typography';
import { Grid } from '@mui/joy';

export default function StackedBoxesLayout({
  children,
}: React.PropsWithChildren<{ reversed?: boolean }>) {
  return (
    <Container
      sx={[
        (theme) => ({
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          py: 5,
          gap: 4,
          flexDirection: 'column',
        }),
      ]}
    > 
      <Typography
        level="h1"
        sx={{
          fontWeight: 'xl',
          fontSize: 'clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)',
        }}
      >
        Advantages
      </Typography>
    <Grid container flexGrow={1} justifyContent='space-between' alignItems={'stretch'} justifyItems={'stretch'} width={'100%'} gap={4}>
      {children}
    </Grid>
    </Container>
  );
}
