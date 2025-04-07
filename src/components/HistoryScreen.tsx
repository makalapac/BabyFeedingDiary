import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { format, parse } from 'date-fns';
import { FeedingSession, DiaperEvent } from '../types';
import { storageService } from '../services/storage';

const HistoryScreen = () => {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const loadData = () => {
      const storedData = storageService.getData();
      setData(storedData);
    };
    loadData();
  }, []);

  const formatTime = (timeStr: string) => {
    try {
      return format(parse(timeStr, 'HH:mm', new Date()), 'HH:mm');
    } catch {
      return timeStr;
    }
  };

  const renderEvent = (event: FeedingSession | DiaperEvent) => {
    if ('dogadjaj' in event) {
      return (
        <TableRow key={`${event.dogadjaj}-${event.vrsta}`}>
          <TableCell colSpan={4}>
            <Typography color="text.secondary">
              Diaper Change: {event.vrsta}
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    return (
      <TableRow key={`${event.start}-${event.strana || event.strane?.join('-')}`}>
        <TableCell>{formatTime(event.start)}</TableCell>
        <TableCell>{event.end ? formatTime(event.end) : '-'}</TableCell>
        <TableCell>
          {event.strana || event.strane?.join(', ') || event.napomena || '-'}
        </TableCell>
        <TableCell>{event.komentar || '-'}</TableCell>
      </TableRow>
    );
  };

  return (
    <Box sx={{ p: 2, pb: 8 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell>Side</TableCell>
              <TableCell>Comment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(data).map(([date, dayData]: [string, any]) => (
              <TableRow key={date}>
                <TableCell colSpan={4}>
                  <Typography variant="h6">{date}</Typography>
                </TableCell>
              </TableRow>
            )).concat(
              Object.entries(data).flatMap(([_, dayData]: [string, any]) =>
                dayData.dojenje.map(renderEvent)
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default HistoryScreen; 