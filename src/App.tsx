
import * as React from 'react';
import { CssVarsProvider, useColorScheme, extendTheme, ThemeProvider } from '@mui/joy/styles';
import './App.css';
import InitColorSchemeScript from '@mui/joy/InitColorSchemeScript';
import { ThemeToggleButton } from './Components/SmallComponents/ThemeToggleButton';
import { HomePage } from './Components/HomePage';
import framesxTheme from './theme';
import { Box } from '@mui/joy';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GeneratePage } from './Components/GeneratePage';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';


function App() {
  const storage = getStorage();
  const db = getFirestore();
  const [auth, setAuth] = React.useState(null);
  return (
    <CssVarsProvider theme = {framesxTheme}>
      <InitColorSchemeScript/>
      <Box className="App" bgcolor={'background.body'} maxWidth={'100vw'} overflow={'hidden'}>
        <ThemeToggleButton/>
        <BrowserRouter>
          <Routes>
            <Route index element={<HomePage/>}/>
            <Route path="/generate" element={<GeneratePage storage={storage} db={db}/>}/>
          </Routes>
        </BrowserRouter>
      </Box>
    </CssVarsProvider>
  );
}

export default App;
