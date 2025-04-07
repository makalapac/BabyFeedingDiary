import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { format } from 'date-fns';
import { WeightMeasurement } from '../types';
import { storageService } from '../services/storage';

const WeightScreen = () => {
  const theme = useTheme();
  const [weight, setWeight] = useState('');
  const [comment, setComment] = useState('');
  const [measurements, setMeasurements] = useState<WeightMeasurement[]>([]);

  useEffect(() => {
    const loadData = () => {
      const today = format(new Date(), 'd.M.yyyy');
      const dayData = storageService.getDayData(today);
      if (dayData) {
        setMeasurements(dayData.vaga);
      }
    };
    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMeasurement: WeightMeasurement = {
      vrijeme: format(new Date(), 'HH:mm'),
      težina: weight,
      komentar: comment || null,
    };
    
    const today = format(new Date(), 'd.M.yyyy');
    storageService.addWeightMeasurement(today, newMeasurement);
    
    setMeasurements([newMeasurement, ...measurements]);
    setWeight('');
    setComment('');
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
              sx={{
                bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.main',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? 'primary.main' : 'primary.dark',
                },
              }}
            >
              Add Measurement
            </Button>
          </Box>
        </form>
      </Paper>

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
    </Box>
  );
};

export default WeightScreen; 