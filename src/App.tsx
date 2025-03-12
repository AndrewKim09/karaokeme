
import * as React from 'react';
import { CssVarsProvider, useColorScheme, extendTheme } from '@mui/joy/styles';
import './App.css';
import InitColorSchemeScript from '@mui/joy/InitColorSchemeScript';
import { ThemeToggleButton } from './Components/SmallComponents/ThemeToggleButton';
import { HomePage } from './Components/HomePage';
import framesxTheme from './theme';

function App() {
  return (
    <CssVarsProvider theme = {framesxTheme}>
      <InitColorSchemeScript/>
      <div className="App">
        <ThemeToggleButton/>
        <HomePage/>
      </div>
    </CssVarsProvider>
  );
}

export default App;
