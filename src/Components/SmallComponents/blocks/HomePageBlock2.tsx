/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import Typography, { typographyClasses } from '@mui/joy/Typography';
import ArrowForward from '@mui/icons-material/ArrowForward';
import TwoSidedLayout from '../TwoSidedLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import StackedBoxesLayout from '../StackedBoxesLayout';
import { Box, Container, Grid, useColorScheme } from '@mui/joy';
import theme from '../../../theme';

export default function HomePageBlock2() {
  const {mode, setMode} = useColorScheme();
  return (
    <StackedBoxesLayout>
      <Grid 
        xs={11} border={'2px solid'} borderColor={'primary.outlinedBorder'}  boxShadow={'md'} borderRadius={'md'} lg={5} xl={3.5}
        sx={(theme) => ({
          [theme.breakpoints.up(1200)]: {
            height: '400px',
          },
          [theme.breakpoints.down(1200)]: {
            height: '250px',
          },
          [theme.breakpoints.down(430)]: {
            height: '350px'
          },
          [theme.breakpoints.up(1536)]: {
            height: '600px',
          }
        })}
      >
        <Container
          sx={[
            (theme) => ({
              position: 'relative',
              display: 'flex',
              height: '100%',
              [theme.breakpoints.down(1200)]: {
                alignItems: 'center',
                flexDirection: 'row',
                gap: 4,
              },
              [theme.breakpoints.up(1200)]: {
                flexDirection: 'column',
                gap: 6,
                alignItems:'center',
                
              },
              [theme.breakpoints.down(430)]: {
                flexDirection: 'column',
                gap: 6,
                alignItems:'center',
              
              }
            }),
          ]}
          >
            <Box
              sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centers content vertically
                height: '100%', // Make sure the parent has a defined height
                width: '70%',
                [theme.breakpoints.down(430)]: {
                  width: '100%',
                  textAlign: 'center',
                  justifyContent: 'space-evenly',
                  height: '50%',
                },
                [theme.breakpoints.between(430, 1200)]: {
                  alignItems: 'start',
                  justifyContent: 'start',
                  py: 4,
                  gap: 7,
                  textAlign: 'start',
                },
                [theme.breakpoints.up(1200)]: {
                  width: '50%',
                  height: '30%',
                  justifyContent: 'space-evenly'
                },
                [`& .${typographyClasses.root}`]: {
                  textWrap: 'balance',
                },
              })}
            >
              <Typography level="h2">Get The Exact Instrumentals</Typography>
              <Typography>Generate karaoke of the song you love using the power of Deep Learning</Typography>
            </Box>
            
            <Box 
              borderRadius={'md'}
              boxShadow={'xl'}
              sx={(theme) => ({
                [theme.breakpoints.down(1200)]: {
                  width: '200px',
                  height: '200px',
                  position: 'absolute',
                  right: '-70px',
                },
                [theme.breakpoints.down(430)]: {
                  width: '200px',
                  height: '200px',
                  right: '50%',
                  transform: 'translateX(50%)',
                  bottom: '-80px'
                },
                [theme.breakpoints.up(1200)]: {
                  width: '300px',
                  height: '300px',
                  alignSelf: 'center',
                }
              })}
            >
              <img
                src="https://images.unsplash.com/photo-1483791424735-e9ad0209eea2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                alt=""
                className='h-full w-full rounded-md'
              />
            </Box>

        </Container>
      </Grid>
      
      <Grid 
        xs={11} border={'2px solid'} borderColor={'primary.outlinedBorder'}  boxShadow={'md'} borderRadius={'md'} lg={5} xl={3.5}
        sx={(theme) => ({
          [theme.breakpoints.up(1200)]: {
            height: '400px',
          },
          [theme.breakpoints.down(1200)]: {
            height: '250px',
          },
          [theme.breakpoints.down(430)]: {
            height: '350px'
          },
          [theme.breakpoints.up(1536)]: {
            height: '600px',
          }
        })}
      >
        <Container
          sx={[
            (theme) => ({
              position: 'relative',
              display: 'flex',
              height: '100%',
              [theme.breakpoints.down(1200)]: {
                alignItems: 'center',
                flexDirection: 'row',
                gap: 4,
              },
              [theme.breakpoints.up(1200)]: {
                flexDirection: 'column',
                gap: 6,
                alignItems:'center',
                
              },
              [theme.breakpoints.down(430)]: {
                flexDirection: 'column',
                gap: 6,
                alignItems:'center',
              
              }
            }),
          ]}
          >
            <Box
              sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centers content vertically
                height: '100%', // Make sure the parent has a defined height
                width: '70%',
                [theme.breakpoints.down(430)]: {
                  width: '100%',
                  textAlign: 'center',
                  justifyContent: 'space-evenly',
                  height: '50%',

                },
                [theme.breakpoints.between(430, 1200)]: {
                  alignItems: 'start',
                  justifyContent: 'start',
                  py: 4,
                  gap: 7,
                  textAlign: 'start',
                },
                [theme.breakpoints.up(1200)]: {
                  width: '50%',
                  height: '30%',
                  justifyContent: 'space-evenly'
                },
                [`& .${typographyClasses.root}`]: {
                  textWrap: 'balance',
                },
              })}
            >
              <Typography level="h2">Get The Exact Instrumentals</Typography>
              <Typography>Generate karaoke of the song you love using the power of Deep Learning</Typography>
            </Box>
            
            <Box 
              borderRadius={'md'}
              boxShadow={'xl'}
              sx={(theme) => ({
                [theme.breakpoints.down(1200)]: {
                  width: '200px',
                  height: '200px',
                  position: 'absolute',
                  right: '-70px',
                },
                [theme.breakpoints.down(430)]: {
                  width: '200px',
                  height: '200px',
                  right: '50%',
                  transform: 'translateX(50%)',
                  bottom: '-80px'
                },
                [theme.breakpoints.up(1200)]: {
                  width: '300px',
                  height: '300px',
                  alignSelf: 'center',
                }
              })}
            >
              <img
                src="https://images.unsplash.com/photo-1483791424735-e9ad0209eea2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                alt=""
                className='h-full w-full rounded-md'
              />
            </Box>

        </Container>
      </Grid>

      <Grid 
        xs={11} border={'2px solid'} borderColor={'primary.outlinedBorder'}  boxShadow={'md'} borderRadius={'md'} minHeight={'200px'} lg={12} xl={3.5}
        sx={(theme) => ({
          [theme.breakpoints.between(1200, 1536)]: {
            height: '350px',
            width: '93%',
            marginTop: '50px',
          },
          [theme.breakpoints.down(1200)]: {
            height: '250px',
          },
          [theme.breakpoints.down(430)]: {
            height: '350px'
          }
        })}
      >
        <Container
          sx={[
            (theme) => ({
              position: 'relative',
              display: 'flex',
              height: '100%',
              [theme.breakpoints.down(430)]: {
                flexDirection: 'column',
                gap: 6,
                alignItems:'center',
              },
              
              [theme.breakpoints.between(430, 1200)]: {
                alignItems: 'center',
                flexDirection: 'row',
                gap: 4,
              },
              [theme.breakpoints.between(1200, 1536)]: {
                flexDirection: 'row',
                gap: 6,
                alignItems:'center',
                justifyContent: 'space-between',
              },
              [theme.breakpoints.up(1536)]: {
                flexDirection: 'column',
                gap: 6,
                alignItems:'center',
                height: '600px',
              },

            }),
          ]}
          >
            <Box
              sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centers content vertically
                height: '100%', // Make sure the parent has a defined height
                width: '70%',
                [theme.breakpoints.up(834)]: {
                  minWidth: 420,
                },
                [theme.breakpoints.between(430,1200)]: {
                  alignItems: 'start',
                  justifyContent: 'start',
                  py: 4,
                  gap: 7,
                  textAlign: 'start',
                },
                [theme.breakpoints.up(1200)]: {
                  width: '70%',
                  height: '30%',
                  justifyContent: 'space-evenly'
                  
                },
                [theme.breakpoints.down(430)]: {
                  width: '100%',
                  textAlign: 'center',
                  justifyContent: 'space-evenly',
                  height: '50%',
                },
                [`& .${typographyClasses.root}`]: {
                  textWrap: 'balance',
                },
              })}
            >
              <Typography level="h2">Get The Exact Instrumentals</Typography>
              <Typography >Generate karaoke of the song you love using the power of Deep Learning</Typography>
            </Box>
            
            <Box 
              borderRadius={'md'}
              boxShadow={'xl'}
              sx={(theme) => ({
                [theme.breakpoints.down(1200)]: {
                  width: '200px',
                  height: '200px',
                  position: 'absolute',
                  right: '-70px',
                },
                [theme.breakpoints.down(430)]: {
                  width: '200px',
                  height: '200px',
                  right: '50%',
                  transform: 'translateX(50%)',
                  bottom: '-80px'
                },
                [theme.breakpoints.up(1200)]: {
                  width: '300px',
                  height: '300px',
                  alignSelf: 'center',
                }
              })}
            >
              <img
                src="https://images.unsplash.com/photo-1483791424735-e9ad0209eea2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                alt=""
                className='h-full w-full rounded-md'
              />
            </Box>
            
          </Container>
      </Grid>
    </StackedBoxesLayout>
  );
}

/*
        sx={(theme) => ({
          [theme.breakpoints.down(1200)]: {
            
          },
          [theme.breakpoints.down(1535)]: {
            height: '350px',
            width: '85%',
            marginTop: '50px',
          },
          [theme.breakpoints.up(1535)]: {
          }Sick of karaoke tracks always having weird instrumentals? Use KarokeMe to extract the exact instrumentals from the songs using the power of Deep Learning Technology
        })}
          */
