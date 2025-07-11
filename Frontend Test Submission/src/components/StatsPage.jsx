import React, { useEffect, useState } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Log } from '../logger';

export default function StatsPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [copyMsg, setCopyMsg] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('urlStats');
    const parsed = stored ? JSON.parse(stored) : [];
    setStats(parsed);
    setLoading(false);
    Log('Fetch Stats - Success', { count: parsed.length });
  }, []);

  const handleShortUrlClick = (row) => {
    setSelectedUrl(row);
    setDialogOpen(true);
    setCopyMsg('');
    Log('Short URL Clicked', { shortUrl: row.shortUrl, originalUrl: row.originalUrl });
  };

  const handleCopy = () => {
    if (selectedUrl) {
      navigator.clipboard.writeText(selectedUrl.originalUrl);
      setCopyMsg('Copied!');
      Log('Original URL Copied', { originalUrl: selectedUrl.originalUrl });
    }
  };

  const handleOpen = () => {
    if (selectedUrl) {
      window.open(selectedUrl.originalUrl, '_blank', 'noopener,noreferrer');
      Log('Original URL Opened', { originalUrl: selectedUrl.originalUrl });
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedUrl(null);
    setCopyMsg('');
  };

  if (loading) return <CircularProgress sx={{ mt: 6, mx: 'auto', display: 'block' }} />;
  if (!stats.length) return <Typography sx={{ mt: 6 }}>No stats available.</Typography>;

  return (
    <Paper className="glass fade-in" sx={{ p: 4, mt: 6 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 800, letterSpacing: 1, color: 'primary.light' }}>URL Statistics</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short URL</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Expiry</TableCell>
              <TableCell>Clicks</TableCell>
              <TableCell>Last Click</TableCell>
              <TableCell>Source</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <Button color="primary" onClick={() => handleShortUrlClick(row)} aria-label={`Show original for ${row.shortUrl}`}>{row.shortUrl}</Button>
                </TableCell>
                <TableCell>{row.originalUrl}</TableCell>
                <TableCell>{row.expiry || 'None'}</TableCell>
                <TableCell>{row.clicks}</TableCell>
                <TableCell>{row.lastClick ? new Date(row.lastClick).toLocaleString() : '-'}</TableCell>
                <TableCell>{row.source || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="original-url-dialog-title">
        <DialogTitle id="original-url-dialog-title">Original URL</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ wordBreak: 'break-all', mr: 1 }}>
              {selectedUrl?.originalUrl}
            </Typography>
            <Tooltip title="Copy">
              <IconButton onClick={handleCopy} aria-label="Copy original URL">
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Open in new tab">
              <IconButton onClick={handleOpen} aria-label="Open original URL in new tab">
                <OpenInNewIcon />
              </IconButton>
            </Tooltip>
            {copyMsg && <Typography color="success.main" sx={{ ml: 1 }}>{copyMsg}</Typography>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} aria-label="Close dialog">Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
