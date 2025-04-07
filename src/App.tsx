import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, IconButton, Box } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useState, useMemo } from 'react';
import FeedingScreen from './components/FeedingScreen';
import HistoryScreen from './components/HistoryScreen';
import WeightScreen from './components/WeightScreen';
import Navigation from './components/Navigation';

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#FF69B4',
          },
          secondary: {
            main: '#87CEEB',
          },
          background: {
            default: mode === 'dark' ? '#121212' : '#ffffff',
            paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
          },
        },
      }),
    [mode]
  );

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              position: 'fixed',
              top: 10,
              right: 10,
              zIndex: 1000,
            }}
          >
            <IconButton onClick={toggleColorMode} color="inherit">
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
          <Routes>
            <Route path="/" element={<FeedingScreen />} />
            <Route path="/history" element={<HistoryScreen />} />
            <Route path="/weight" element={<WeightScreen />} />
          </Routes>
          <Navigation />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 