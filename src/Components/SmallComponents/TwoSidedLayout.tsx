import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Container from '@mui/joy/Container';
import { typographyClasses } from '@mui/joy/Typography';
import { useColorScheme } from '@mui/joy';

export default function TwoSidedLayout({
  children,
  reversed,
}: React.PropsWithChildren<{ reversed?: boolean }>) {
  const { mode } = useColorScheme();
  return (
    <Container
      sx={[
        (theme) => ({
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 10,
          gap: 12,
          [theme.breakpoints.up(834)]: {
            flexDirection: 'row',
            gap: 6,
          },
          [theme.breakpoints.up(1199)]: {
            gap: 12,
          },
        }),
        reversed ? { flexDirection: 'column-reverse' } : { flexDirection: 'column' },
      ]}
    > 
      <Box
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          maxWidth: '50ch',
          textAlign: 'center',
          flexShrink: 999,
          [theme.breakpoints.up(834)]: {
            minWidth: 420,
            alignItems: 'flex-start',
            textAlign: 'start',
          },
          [`& .${typographyClasses.root}`]: {
            textWrap: 'balance',
          },
        })}
      >
        {children}
      </Box>
      <AspectRatio
        ratio={600 / 520}
        variant='outlined'
        maxHeight={300}
        sx={(theme) => ({
          minWidth: 300,
          alignSelf: 'stretch',
          [theme.breakpoints.up(834)]: {
            alignSelf: 'initial',
            flexGrow: 1,
            '--AspectRatio-maxHeight': '520px',
            '--AspectRatio-minHeight': '400px',
          },
          borderRadius: 'sm',
          flexBasis: '50%',
        })}
      >
        <img src={mode === 'light' ? '/karaokeMeDrawingLight.png' : '/karaokeMeDrawingDark.png'} alt="Karaoke Me Drawing" className='h-[100%] aspect-square'/>
      </AspectRatio>
    </Container>
  );
}
