/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import TwoSidedLayout from '../TwoSidedLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { GoogleSignInButton } from '../GoogleSignInButton';
import { Link as RouterLink } from 'react-router';

export default function HomePageBlock1() {
  return (
    <TwoSidedLayout>
      <Typography
        level="h1"
        sx={{
          fontWeight: 'xl',
          fontSize: 'clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)',
        }}
      >
        KaraokeMe
        <FontAwesomeIcon icon={faMicrophone} className='text-3xl text-yellow-400 ml-2'/>
      </Typography>
      <Typography
        textColor="text.secondary"
        sx={{ fontSize: 'lg', lineHeight: 'lg' }}
      >
        A free tool to generate karaoke tracks from any song.
      </Typography>
      <GoogleSignInButton/>
      <Typography>
         <Link sx={{ fontWeight: 'lg' }} component={RouterLink} to="/generate">Continue without Signing in</Link>
      </Typography>
    </TwoSidedLayout>
  );
}
