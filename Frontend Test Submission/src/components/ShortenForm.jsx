import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, Grid, Tooltip, InputAdornment, Zoom, Snackbar, Alert, CircularProgress } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CodeIcon from '@mui/icons-material/Code';
import { Log } from '../logger';
import '../App.css';

const URL_REGEX = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/i;

function generateShortUrl(code) {
  // Use custom code or random
  const shortCode = code && code.trim() ? code.trim() : Math.random().toString(36).substring(2, 8);
  return '/short/' + shortCode;
}

function saveUrlMapping(originalUrl, shortUrl, expiry) {
  const stats = JSON.parse(localStorage.getItem('urlStats') || '[]');
  stats.push({
    originalUrl,
    shortUrl,
    expiry,
    clicks: 0,
    lastClick: null,
    source: 'local',
  });
  localStorage.setItem('urlStats', JSON.stringify(stats));
}

const initialRows = Array(5).fill().map(() => ({ url: '', expiry: '', code: '' }));

export default function ShortenForm() {
  const [rows, setRows] = useState(initialRows);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  const handleChange = (idx, field, value) => {
    setRows(rows => rows.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResults([]);
    setLoading(true);
    setTimeout(() => {
      const validRows = rows.filter(row => row.url.trim());
      if (validRows.length === 0) {
        setError('Please enter at least one URL.');
        setLoading(false);
        return;
      }
      const invalids = validRows.filter(row => !URL_REGEX.test(row.url));
      if (invalids.length > 0) {
        setError('Invalid URL(s): ' + invalids.map(r => r.url).join(', '));
        Log('Shorten URL - Validation Failed', { invalids });
        setSnackbar({ open: true, message: 'Invalid URL(s) detected.', severity: 'error' });
        setLoading(false);
        return;
      }
      const newResults = validRows.map(row => {
        const shortUrl = generateShortUrl(row.code);
        saveUrlMapping(row.url, shortUrl, row.expiry);
        Log('Shorten URL - Success', { originalUrl: row.url, shortUrl, expiry: row.expiry });
        return { originalUrl: row.url, shortUrl, expiry: row.expiry };
      });
      setResults(newResults);
      setSnackbar({ open: true, message: 'URLs shortened successfully!', severity: 'success' });
      setLoading(false);
    }, 700); // Simulate async
  };

  return (
    <Zoom in={true}>
      <Paper className="glass fade-in" sx={{ p: 4, maxWidth: 850, mx: 'auto', mt: 6, borderRadius: 5, border: '1.5px solid #333', boxShadow: '0 8px 32px 0 #0005' }} aria-label="Shorten URL Form" role="form">
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 900, letterSpacing: 1, color: 'primary.light', textShadow: '0 2px 8px #0008' }}>
          <LinkIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'secondary.main', fontSize: 32 }} aria-label="Link Icon" /> Shorten up to 5 URLs
        </Typography>
        <Box component="form" onSubmit={handleSubmit} autoComplete="off">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={5}><Typography variant="subtitle2">URL</Typography></Grid>
            <Grid item xs={3}><Typography variant="subtitle2">Expiry Date</Typography></Grid>
            <Grid item xs={4}><Typography variant="subtitle2">Custom Short Code</Typography></Grid>
            {rows.map((row, idx) => (
              <React.Fragment key={idx}>
                <Grid item xs={5}>
                  <TextField
                    label={`URL ${idx + 1}`}
                    variant="outlined"
                    fullWidth
                    value={row.url}
                    onChange={e => handleChange(idx, 'url', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Tooltip title="Paste a valid URL"><LinkIcon color="primary" aria-label="URL Icon" /></Tooltip>
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{ 'aria-label': `URL input ${idx + 1}` }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Expiry"
                    type="date"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={row.expiry}
                    onChange={e => handleChange(idx, 'expiry', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Tooltip title="Expiry Date"><CalendarMonthIcon color="secondary" aria-label="Expiry Icon" /></Tooltip>
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{ 'aria-label': `Expiry date input ${idx + 1}` }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Short Code (optional)"
                    variant="outlined"
                    fullWidth
                    value={row.code}
                    onChange={e => handleChange(idx, 'code', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Tooltip title="Custom Short Code"><CodeIcon color="secondary" aria-label="Short Code Icon" /></Tooltip>
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{ 'aria-label': `Short code input ${idx + 1}` }}
                  />
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          <Box sx={{ position: 'relative' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, fontWeight: 700, fontSize: 20, py: 1.5, letterSpacing: 1, borderRadius: 3, boxShadow: '0 2px 12px #0006', transition: 'all 0.3s', '&:hover': { background: 'linear-gradient(90deg,#1976d2 60%,#f48fb1 100%)', color: '#fff' } }}
              aria-label="Shorten URLs"
            >
              Shorten
            </Button>
            {loading && <CircularProgress size={32} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-16px', ml: '-16px', color: 'secondary.main' }} aria-label="Loading" />}
          </Box>
        </Box>
        {results.length > 0 && (
          <Box mt={3} className="fade-in">
            <Typography variant="subtitle1" sx={{ color: 'secondary.light', fontWeight: 700, fontSize: 20 }}>Shortened URLs:</Typography>
            {results.map((res, idx) => (
              <Paper key={idx} className="glass" sx={{ mb: 2, p: 2, border: '1.5px solid #333', borderRadius: 3, background: 'rgba(36,40,54,0.8)', transition: 'box-shadow 0.3s', boxShadow: '0 2px 12px #0004', '&:hover': { boxShadow: '0 4px 24px #0007', borderColor: 'primary.main' } }}>
                <Button
                  variant="text"
                  color="primary"
                  sx={{ fontWeight: 700, fontSize: 18, textTransform: 'none', pl: 0 }}
                  onClick={() => window.open(res.originalUrl, '_blank', 'noopener,noreferrer')}
                  aria-label={`Open original URL for ${res.shortUrl}`}
                >
                  {res.shortUrl}
                </Button>
                <Typography variant="body2" sx={{ color: 'grey.400' }}>Original: {res.originalUrl}</Typography>
                <Typography variant="body2" sx={{ color: 'secondary.light' }}>Expiry: {res.expiry || 'None'}</Typography>
              </Paper>
            ))}
          </Box>
        )}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2500}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Zoom>
  );
}
