/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import ArrowForward from '@mui/icons-material/ArrowForward';
import TwoSidedLayout from '../TwoSidedLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import StackedBoxesLayout from '../StackedBoxesLayout';
import { Grid } from '@mui/joy';

export default function HomePageBlock2() {
  return (
    <StackedBoxesLayout>
      <Grid 
        xs={12} md={3.5} border={'1px solid black'} borderRadius={'md'} minHeight={'200px'}
      >
        awd
      </Grid>
      <Grid 
        xs={12} md={3.5} border={'1px solid black'} borderRadius={'md'} minHeight={'200px'}
      >
        awd
      </Grid>
      <Grid 
        xs={12} md={3.5} border={'1px solid black'} borderRadius={'md'} minHeight={'200px'}
      >
        awd
      </Grid>
    </StackedBoxesLayout>
  );
}
