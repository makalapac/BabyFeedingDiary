import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, useTheme, Snackbar, Alert } from '@mui/material';
import { format } from 'date-fns';
import { storageService } from '../services/storage';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';

const FeedingScreen = () => {
  const theme = useTheme();
  const [activeFeeding, setActiveFeeding] = useState<{
    start: Date;
    side: 'L' | 'D';
  } | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>('00:00');
  const [comment, setComment] = useState<string>('');
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    type: 'success',
  });

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
      
      // Show notification
      setNotification({
        open: true,
        message: `Feeding session ended: ${activeFeeding.side === 'L' ? 'Left' : 'Right'} breast`,
        type: 'success',
      });
    }
  };

  const recordDiaperChange = (type: 'popiškena' | 'pokakana' | 'both') => {
    const now = new Date();
    const diaperData = {
      dogadjaj: 'pelena',
      vrsta: type,
      start: format(now, 'HH:mm'),
      end: format(now, 'HH:mm'),
    };
    
    const today = format(now, 'd.M.yyyy');
    storageService.addFeedingSession(today, diaperData);
    
    // Show notification
    let message = '';
    switch (type) {
      case 'popiškena':
        message = 'Wet diaper recorded';
        break;
      case 'pokakana':
        message = 'Poopy diaper recorded';
        break;
      case 'both':
        message = 'Both wet and poopy diaper recorded';
        break;
    }
    
    setNotification({
      open: true,
      message,
      type: 'info',
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
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
        bgcolor: 'background.default',
      }}
    >
      {!activeFeeding ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', maxWidth: 500 }}>
          {/* Breastfeeding Section */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.light',
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.primary', 
                fontWeight: 'bold',
                textAlign: 'center',
                mb: 2,
              }}
            >
              Breastfeeding
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  width: 150,
                  height: 150,
                  fontSize: '1.5rem',
                  bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.main',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? 'primary.main' : 'primary.dark',
                  },
                  borderRadius: 2,
                }}
                onClick={() => startFeeding('L')}
              >
                Left
              </Button>
              <Button
                variant="contained"
                size="large"
                sx={{
                  width: 150,
                  height: 150,
                  fontSize: '1.5rem',
                  bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.main',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? 'primary.main' : 'primary.dark',
                  },
                  borderRadius: 2,
                }}
                onClick={() => startFeeding('D')}
              >
                Right
              </Button>
            </Box>
          </Paper>

          {/* Diaper Change Section */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: theme.palette.mode === 'dark' ? 'secondary.dark' : 'secondary.light',
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.primary', 
                fontWeight: 'bold',
                textAlign: 'center',
                mb: 2,
              }}
            >
              Diaper Change
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<WaterDropIcon />}
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: '1.2rem',
                  bgcolor: theme.palette.mode === 'dark' ? 'info.dark' : 'info.main',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? 'info.main' : 'info.dark',
                  },
                  borderRadius: 2,
                }}
                onClick={() => recordDiaperChange('popiškena')}
              >
                Wet
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={<LocalFireDepartmentIcon />}
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: '1.2rem',
                  bgcolor: theme.palette.mode === 'dark' ? 'warning.dark' : 'warning.main',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? 'warning.main' : 'warning.dark',
                  },
                  borderRadius: 2,
                }}
                onClick={() => recordDiaperChange('pokakana')}
              >
                Poop
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={<AllInclusiveIcon />}
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: '1.2rem',
                  bgcolor: theme.palette.mode === 'dark' ? 'secondary.dark' : 'secondary.main',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? 'secondary.main' : 'secondary.dark',
                  },
                  borderRadius: 2,
                }}
                onClick={() => recordDiaperChange('both')}
              >
                Both
              </Button>
            </Box>
          </Paper>
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
            bgcolor: 'background.paper',
            borderRadius: 2,
            maxWidth: 500,
            width: '100%',
          }}
        >
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
            {elapsedTime}
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            {activeFeeding.side === 'L' ? 'Left' : 'Right'} Breast
          </Typography>
          <TextField
            label="Comment"
            multiline
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            sx={{
              '& .MuiInputBase-root': {
                color: 'text.primary',
              },
              '& .MuiInputLabel-root': {
                color: 'text.secondary',
              },
            }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={endFeeding}
            fullWidth
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? 'secondary.dark' : 'secondary.main',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' ? 'secondary.main' : 'secondary.dark',
              },
              borderRadius: 2,
            }}
          >
            End Feeding
          </Button>
        </Paper>
      )}
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={3000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.type} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FeedingScreen; 