import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';

function App() {
  const [topic, setTopic] = useState('');
  const [videoType, setVideoType] = useState('YouTube Video');
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://video-script-writer-production.up.railway.app/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, videoType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate script');
      }

      const data = await response.json();
      setScript(data.script);
    } catch (err) {
      setError(err.message);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold',
          textAlign: 'center',
          color: 'primary.main',
          mb: 4
        }}
      >
        AI Script Writer
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Video Topic"
            variant="outlined"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Video Type"
            variant="outlined"
            value={videoType}
            onChange={(e) => setVideoType(e.target.value)}
            margin="normal"
            select
            SelectProps={{ native: true }}
          >
            <option value="YouTube Video">YouTube Video</option>
            <option value="TikTok Short">TikTok Short</option>
            <option value="Instagram Reel">Instagram Reel</option>
            <option value="Corporate Video">Corporate Video</option>
          </TextField>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Generate Script'
            )}
          </Button>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </form>
      </Paper>

      {/* Display the Generated Script with Markdown Formatting */}
      {script && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Generated Script:
          </Typography>
          <Box sx={{ whiteSpace: 'pre-wrap' }}>
            <ReactMarkdown>{script}</ReactMarkdown>
          </Box>
        </Paper>
      )}
    </Container>
  );
}

export default App;
