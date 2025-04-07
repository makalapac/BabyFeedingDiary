import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Home, History, Scale } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation
        value={location.pathname}
        onChange={(_, newValue) => {
          navigate(newValue);
        }}
      >
        <BottomNavigationAction
          label="Feed"
          value="/"
          icon={<Home />}
        />
        <BottomNavigationAction
          label="History"
          value="/history"
          icon={<History />}
        />
        <BottomNavigationAction
          label="Weight"
          value="/weight"
          icon={<Scale />}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default Navigation; 