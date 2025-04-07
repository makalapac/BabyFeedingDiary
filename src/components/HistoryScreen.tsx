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
  useTheme,
} from '@mui/material';
import { format, parse } from 'date-fns';
import { FeedingSession, DiaperEvent } from '../types';
import { storageService } from '../services/storage';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';

const HistoryScreen = () => {
  const theme = useTheme();
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

  const getDiaperIcon = (type: string) => {
    switch (type) {
      case 'popiškena':
        return <WaterDropIcon fontSize="small" sx={{ color: theme.palette.info.main }} />;
      case 'pokakana':
        return <LocalFireDepartmentIcon fontSize="small" sx={{ color: theme.palette.warning.main }} />;
      case 'both':
        return <AllInclusiveIcon fontSize="small" sx={{ color: theme.palette.secondary.main }} />;
      default:
        return null;
    }
  };

  const getDiaperTypeText = (type: string) => {
    switch (type) {
      case 'popiškena':
        return 'Wet';
      case 'pokakana':
        return 'Poopy';
      case 'both':
        return 'Both';
      default:
        return type;
    }
  };

  const renderEvent = (event: FeedingSession | DiaperEvent) => {
    if ('dogadjaj' in event) {
      return (
        <TableRow key={`${event.dogadjaj}-${event.vrsta}`}>
          <TableCell colSpan={4} sx={{ color: 'text.primary' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getDiaperIcon(event.vrsta)}
              <Typography>
                {getDiaperTypeText(event.vrsta)} Diaper ({event.start ? formatTime(event.start) : '-'})
              </Typography>
              {event.komentar && (
                <Typography sx={{ ml: 2, color: 'text.secondary' }}>
                  - {event.komentar}
                </Typography>
              )}
            </Box>
          </TableCell>
        </TableRow>
      );
    }

    return (
      <TableRow key={`${event.start}-${event.strana || event.strane?.join('-')}`}>
        <TableCell sx={{ color: 'text.primary' }}>{formatTime(event.start)}</TableCell>
        <TableCell sx={{ color: 'text.primary' }}>{event.end ? formatTime(event.end) : '-'}</TableCell>
        <TableCell sx={{ color: 'text.primary' }}>
          {event.strana || event.strane?.join(', ') || event.napomena || '-'}
        </TableCell>
        <TableCell sx={{ color: 'text.primary' }}>{event.komentar || '-'}</TableCell>
      </TableRow>
    );
  };

  return (
    <Box sx={{ p: 2, pb: 8, bgcolor: 'background.default' }}>
      <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Start</TableCell>
              <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>End</TableCell>
              <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Side</TableCell>
              <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Comment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(data).map(([date, dayData]: [string, any]) => (
              <TableRow key={date}>
                <TableCell colSpan={4}>
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                    {date}
                  </Typography>
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