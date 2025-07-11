import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, CssBaseline, ThemeProvider, createTheme, Avatar, Fab } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShortenForm from './components/ShortenForm';
import StatsPage from './components/StatsPage';
import './App.css';
import { setTokenIfMissing } from './utils/token';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    secondary: { main: '#f48fb1' },
    background: { default: '#181c24', paper: '#23293a' },
  },
  shape: { borderRadius: 18 },
  typography: {
    fontFamily: 'Montserrat, Roboto, Arial',
    h5: { fontWeight: 800 },
    subtitle1: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          transition: 'background 0.3s, color 0.3s',
          borderRadius: 12,
          fontWeight: 600,
          '&:hover': {
            background: 'linear-gradient(90deg,#1976d2 60%,#f48fb1 100%)',
            color: '#fff',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            transition: 'box-shadow 0.3s',
            borderRadius: 12,
            '&:hover fieldset': {
              borderColor: '#90caf9',
              boxShadow: '0 0 0 2px #90caf933',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#f48fb1',
              boxShadow: '0 0 0 2px #f48fb133',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 32px 0 #0003',
          borderRadius: 24,
        },
      },
    },
  },
});

function FloatingStatsButton() {
  const navigate = useNavigate();
  return (
    <Fab color="secondary" className="fab" aria-label="stats" onClick={() => navigate('/stats')}>
      <BarChartIcon fontSize="large" />
    </Fab>
  );
}

function App() {
  useEffect(() => {
    setTokenIfMissing();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <AppBar position="static" color="primary" elevation={4} sx={{ mb: 2, borderRadius: 0, background: 'rgba(36,40,54,0.95)', backdropFilter: 'blur(8px)' }}>
          <Toolbar>
            <Avatar src="https://api.dicebear.com/7.x/shapes/svg?seed=shortener" sx={{ mr: 2, bgcolor: 'secondary.main', width: 48, height: 48, boxShadow: 2 }} />
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 900, letterSpacing: 2, fontSize: 28, color: 'primary.light', textShadow: '0 2px 8px #0008' }}>
              Pro URL Shortener
            </Typography>
            <Button color="inherit" component={Link} to="/" sx={{ fontWeight: 700, fontSize: 18 }}>Shorten URL</Button>
            <Button color="inherit" component={Link} to="/stats" sx={{ fontWeight: 700, fontSize: 18 }}>Statistics</Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<ShortenForm />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </Container>
        <FloatingStatsButton />
        <footer>
          &copy; {new Date().getFullYear()} Pro URL Shortener &mdash; <a href="mailto:2691a32c0@mits.ac.in" style={{ color: '#90caf9', textDecoration: 'underline' }}>Contact Support</a>
        </footer>
      </Router>
    </ThemeProvider>
  );
}

export default App;
