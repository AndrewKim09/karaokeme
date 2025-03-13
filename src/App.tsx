
import * as React from 'react';
import { CssVarsProvider, useColorScheme, extendTheme } from '@mui/joy/styles';
import './App.css';
import InitColorSchemeScript from '@mui/joy/InitColorSchemeScript';
import { ThemeToggleButton } from './Components/SmallComponents/ThemeToggleButton';
import { HomePage } from './Components/HomePage';
import framesxTheme from './theme';
import { Box } from '@mui/joy';

function Body(){
  const { mode, setMode } = useColorScheme();
  return(
    <Box className="App" bgcolor={'background.body'}>
      <ThemeToggleButton/>
      <HomePage/>
    </Box>
  )
}

function App() {
  return (
    <CssVarsProvider theme = {framesxTheme}>
      <InitColorSchemeScript/>
      <Body/>
    </CssVarsProvider>
  );
}

export default App;
