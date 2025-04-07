import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { format } from 'date-fns';
import { storageService } from '../services/storage';

const FeedingScreen = () => {
  const [activeFeeding, setActiveFeeding] = useState<{
    start: Date;
    side: 'L' | 'D';
  } | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>('00:00');
  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    let interval: number | undefined;
    if (activeFeeding) {
      interval = window.setInterval(() => {
        const now = new Date();
        const diff = now.getTime() - activeFeeding.start.getTime();
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setElapsedTime(
          `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeFeeding]);

  const startFeeding = (side: 'L' | 'D') => {
    setActiveFeeding({
      start: new Date(),
      side,
    });
    setElapsedTime('00:00');
  };

  const endFeeding = () => {
    if (activeFeeding) {
      const feedingData = {
        start: format(activeFeeding.start, 'HH:mm'),
        end: format(new Date(), 'HH:mm'),
        strana: activeFeeding.side,
        komentar: comment || null,
      };
      
      const today = format(new Date(), 'd.M.yyyy');
      storageService.addFeedingSession(today, feedingData);
      
      setActiveFeeding(null);
      setComment('');
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        pb: 8,
      }}
    >
      {!activeFeeding ? (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            sx={{ width: 150, height: 150 }}
            onClick={() => startFeeding('L')}
          >
            Left
          </Button>
          <Button
            variant="contained"
            size="large"
            sx={{ width: 150, height: 150 }}
            onClick={() => startFeeding('D')}
          >
            Right
          </Button>
        </Box>
      ) : (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="h4">{elapsedTime}</Typography>
          <Typography variant="h6">
            {activeFeeding.side === 'L' ? 'Left' : 'Right'} Breast
          </Typography>
          <TextField
            label="Comment"
            multiline
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={endFeeding}
            fullWidth
          >
            End Feeding
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default FeedingScreen; 