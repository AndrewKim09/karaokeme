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
import { Grid, useColorScheme } from '@mui/joy';

export default function HomePageBlock2() {
  const {mode, setMode} = useColorScheme();
  return (
    <StackedBoxesLayout>
      <Grid 
        xs={12} md={12} border={'2px solid'} borderColor={'primary.outlinedBorder'}  boxShadow={'md'} borderRadius={'md'} minHeight={'200px'} lg={5.5} xl={3.5}
      >

      </Grid>
      <Grid 
        xs={12} md={12} border={'2px solid'} borderColor={'primary.outlinedBorder'} boxShadow={'md'}  borderRadius={'md'} minHeight={'200px'} lg={5.5} xl={3.5}
      >
        awd
      </Grid>
      <Grid 
        xs={12} md={12} border={'2px solid'} borderColor={'primary.outlinedBorder'}  boxShadow={'md'} borderRadius={'md'} minHeight={'200px'} lg={12} xl={3.5}
      >
        awd
      </Grid>
    </StackedBoxesLayout>
  );
}
