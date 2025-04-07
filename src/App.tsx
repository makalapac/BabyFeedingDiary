import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import FeedingScreen from './components/FeedingScreen';
import HistoryScreen from './components/HistoryScreen';
import WeightScreen from './components/WeightScreen';
import Navigation from './components/Navigation';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF69B4',
    },
    secondary: {
      main: '#87CEEB',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
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