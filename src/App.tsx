
import * as React from 'react';
import { CssVarsProvider, useColorScheme, extendTheme } from '@mui/joy/styles';
import './App.css';
import InitColorSchemeScript from '@mui/joy/InitColorSchemeScript';
import { ThemeToggleButton } from './Components/SmallComponents/ThemeToggleButton';
import { HomePage } from './Components/HomePage';
import framesxTheme from './theme';

function Body(){
  const { mode, setMode } = useColorScheme();
  return(
    <div className={`App ${mode === 'dark' ? 'dark bg-black' : 'light bg-gray-100'}`}>
      <ThemeToggleButton/>
      <HomePage/>
    </div>
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
