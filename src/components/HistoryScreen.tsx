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
  Button,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { format, parse } from 'date-fns';
import { FeedingSession, DiaperEvent, TrackingData, DayData } from '../types';
import { storageService } from '../services/storage';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import { Download as DownloadIcon, Backup as BackupIcon, Description as JsonIcon, TableChart as CsvIcon, PictureAsPdf as PdfIcon } from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const HistoryScreen = () => {
  const theme = useTheme();
  const [data, setData] = useState<TrackingData | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const loadData = () => {
      const storedData = storageService.getData();
      setData(storedData);
    };
    loadData();
    // Add event listener for storage changes
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    handleMenuClose();
  };

  const handleExportJson = () => {
    if (!data) return;
    const dataStr = JSON.stringify(data, null, 2);
    downloadFile(
      dataStr, 
      `breastfeeding_data_${new Date().toISOString().split('T')[0]}.json`,
      'application/json'
    );
  };

  const handleExportCsv = () => {
    if (!data) return;
    
    // Create CSV header
    let csvContent = 'Date,Time,Event Type,Details,Comment\n';
    
    // Process each day's data
    Object.entries(data).forEach(([date, dayData]) => {
      dayData.dojenje.forEach((event) => {
        if ('dogadjaj' in event) {
          // Diaper event
          csvContent += `${date},${event.start || '-'},Diaper,${getDiaperTypeText(event.vrsta)},${event.komentar || ''}\n`;
        } else {
          // Feeding event
          csvContent += `${date},${event.start},Feeding,${event.strana || event.strane?.join(', ') || event.napomena || '-'},${event.komentar || ''}\n`;
        }
      });
    });
    
    downloadFile(
      csvContent,
      `breastfeeding_data_${new Date().toISOString().split('T')[0]}.csv`,
      'text/csv'
    );
  };

  const handleExportPdf = () => {
    if (!data) return;
    
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Breastfeeding Tracker - History', 14, 15);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
    
    // Prepare data for the table
    const tableData: string[][] = [];
    
    // Process each day's data
    Object.entries(data).forEach(([date, dayData]) => {
      dayData.dojenje.forEach((event) => {
        if ('dogadjaj' in event) {
          // Diaper event
          tableData.push([
            date,
            event.start || '-',
            'Diaper',
            getDiaperTypeText(event.vrsta),
            event.komentar || ''
          ]);
        } else {
          // Feeding event
          tableData.push([
            date,
            event.start,
            'Feeding',
            event.strana === 'L' ? 'Left' : event.strana === 'D' ? 'Right' : event.strane?.map(s => s === 'L' ? 'Left' : 'Right').join(', ') || '-',
            event.komentar || ''
          ]);
        }
      });
    });
    
    // Add the table
    autoTable(doc, {
      head: [['Date', 'Time', 'Event Type', 'Details', 'Comment']],
      body: tableData,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [255, 105, 180] }, // Pink color for header
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 30 }, // Date
        1: { cellWidth: 25 }, // Time
        2: { cellWidth: 30 }, // Event Type
        3: { cellWidth: 40 }, // Details
        4: { cellWidth: 50 }  // Comment
      }
    });
    
    // Save the PDF
    doc.save(`breastfeeding_data_${new Date().toISOString().split('T')[0]}.pdf`);
    handleMenuClose();
  };

  const renderEvent = (event: FeedingSession | DiaperEvent) => {
    if ('dogadjaj' in event) {
      // Diaper event
      return (
        <>
          <TableCell sx={{ color: 'text.primary' }}>{formatTime(event.start || '')}</TableCell>
          <TableCell sx={{ color: 'text.primary' }}>-</TableCell>
          <TableCell sx={{ color: 'text.primary' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getDiaperIcon(event.vrsta)}
              <Typography>
                {getDiaperTypeText(event.vrsta)} Diaper
              </Typography>
            </Box>
          </TableCell>
          <TableCell sx={{ color: 'text.primary' }}>-</TableCell>
          <TableCell sx={{ color: 'text.primary' }}>{event.komentar || '-'}</TableCell>
        </>
      );
    }

    // Feeding event
    return (
      <>
        <TableCell sx={{ color: 'text.primary' }}>{formatTime(event.start)}</TableCell>
        <TableCell sx={{ color: 'text.primary' }}>{event.end ? formatTime(event.end) : '-'}</TableCell>
        <TableCell sx={{ color: 'text.primary' }}>Feeding</TableCell>
        <TableCell sx={{ color: 'text.primary' }}>
          {event.strana === 'L' ? 'Left' : event.strana === 'D' ? 'Right' : event.strane?.map(s => s === 'L' ? 'Left' : 'Right').join(', ') || '-'}
        </TableCell>
        <TableCell sx={{ color: 'text.primary' }}>{event.komentar || '-'}</TableCell>
      </>
    );
  };

  return (
    <Box sx={{ 
      p: 2, 
      maxWidth: '100%', 
      mx: 'auto',
      bgcolor: 'background.default',
      minHeight: '100vh',
      pb: 8 // Add padding at the bottom to account for the navigation bar
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1" sx={{ color: 'text.primary' }}>
          History
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<BackupIcon />}
            onClick={handleMenuClick}
            sx={{ 
              bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.main',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' ? 'primary.main' : 'primary.dark',
              },
            }}
          >
            Backup Data
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleExportJson}>
              <ListItemIcon>
                <JsonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Export as JSON</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleExportCsv}>
              <ListItemIcon>
                <CsvIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Export as CSV</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleExportPdf}>
              <ListItemIcon>
                <PdfIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Export as PDF</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      {data ? (
        <TableContainer component={Paper} sx={{ bgcolor: 'background.paper', width: '100%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Start</TableCell>
                <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>End</TableCell>
                <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Event</TableCell>
                <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Details</TableCell>
                <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Comments</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(data as Record<string, DayData>).map(([date, dayData]) => (
                <React.Fragment key={date}>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                        {date}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  {dayData.dojenje.map((event, index) => (
                    <TableRow key={index}>
                      {renderEvent(event)}
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography sx={{ color: 'text.primary', textAlign: 'center', mt: 4 }}>
          No history available
        </Typography>
      )}
    </Box>
  );
};

export default HistoryScreen; 