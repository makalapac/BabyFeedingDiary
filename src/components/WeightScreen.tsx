import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { format } from 'date-fns';
import { WeightMeasurement } from '../types';
import { storageService } from '../services/storage';

const WeightScreen = () => {
  const theme = useTheme();
  const [weight, setWeight] = useState('');
  const [comment, setComment] = useState('');
  const [measurements, setMeasurements] = useState<WeightMeasurement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    open: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const today = format(new Date(), 'd.M.yyyy');
        const dayData = await storageService.getDayData(today);
        if (dayData) {
          setMeasurements(dayData.vaga);
        }
      } catch (error) {
        console.error('Error loading weight measurements:', error);
        setNotification({
          open: true,
          message: 'Error loading weight measurements',
          type: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    
    // Add event listener for storage changes
    const handleStorageChange = () => {
      loadData();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const newMeasurement: WeightMeasurement = {
        vrijeme: format(new Date(), 'HH:mm'),
        težina: weight,
        komentar: comment || null,
      };
      
      const today = format(new Date(), 'd.M.yyyy');
      await storageService.addWeightMeasurement(today, newMeasurement);
      
      setMeasurements([newMeasurement, ...measurements]);
      setWeight('');
      setComment('');
      
      setNotification({
        open: true,
        message: 'Weight measurement saved successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error saving weight measurement:', error);
      setNotification({
        open: true,
        message: 'Error saving weight measurement',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ p: 2, pb: 8, bgcolor: 'background.default' }}>
      <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Weight (g)"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              disabled={isLoading}
              sx={{
                '& .MuiInputBase-root': {
                  color: 'text.primary',
                },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                },
              }}
            />
            <TextField
              label="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              multiline
              rows={2}
              disabled={isLoading}
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
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.main',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? 'primary.main' : 'primary.dark',
                },
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Add Measurement'}
            </Button>
          </Box>
        </form>
      </Paper>

      {isLoading && measurements.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Time</TableCell>
                <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Weight</TableCell>
                <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Comment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {measurements.map((measurement, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: 'text.primary' }}>{measurement.vrijeme}</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{measurement.težina}</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{measurement.komentar || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.type}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WeightScreen; 