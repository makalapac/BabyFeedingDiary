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
} from '@mui/material';
import { format } from 'date-fns';
import { WeightMeasurement } from '../types';
import { storageService } from '../services/storage';

const WeightScreen = () => {
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
    <Box sx={{ p: 2, pb: 8 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Weight (g)"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
            <TextField
              label="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              multiline
              rows={2}
            />
            <Button type="submit" variant="contained">
              Add Measurement
            </Button>
          </Box>
        </form>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Weight</TableCell>
              <TableCell>Comment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {measurements.map((measurement, index) => (
              <TableRow key={index}>
                <TableCell>{measurement.vrijeme}</TableCell>
                <TableCell>{measurement.težina}</TableCell>
                <TableCell>{measurement.komentar || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default WeightScreen; 