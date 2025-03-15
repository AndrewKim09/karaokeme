
import * as React from 'react';
import { CssVarsProvider, useColorScheme, extendTheme } from '@mui/joy/styles';
import './App.css';
import InitColorSchemeScript from '@mui/joy/InitColorSchemeScript';
import { ThemeToggleButton } from './Components/SmallComponents/ThemeToggleButton';
import { HomePage } from './Components/HomePage';
import framesxTheme from './theme';
import { Box } from '@mui/joy';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GeneratePage } from './Components/GeneratePage';


function App() {
  return (
    <CssVarsProvider theme = {framesxTheme}>
      <InitColorSchemeScript/>
      <Box className="App" bgcolor={'background.body'}>
        <ThemeToggleButton/>
        <BrowserRouter>
          <Routes>
            <Route index element={<HomePage/>}/>
            <Route path="/generate" element={<GeneratePage/>}/>
          </Routes>
        </BrowserRouter>
      </Box>
    </CssVarsProvider>
  );
}

export default App;
