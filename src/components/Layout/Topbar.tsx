import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Menu as MenuIcon, SwapHoriz as SwapIcon } from '@mui/icons-material';
import { useAuth } from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  onToggleDrawer?: () => void;
}

const Topbar = ({ onToggleDrawer }: TopbarProps) => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
      <Toolbar>
        {isMobile && (
          <IconButton color="inherit" edge="start" onClick={onToggleDrawer} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography
          variant="h6"
          noWrap
          sx={{ cursor: 'pointer', fontWeight: 700 }}
          onClick={() => navigate(profile === 'teacher' ? '/teacher' : '/student')}
        >
          📋 TurmaBoard
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {profile && (
          <>
            <Chip
              label={profile === 'teacher' ? '👩‍🏫 Professor' : '🎓 Aluno'}
              color="secondary"
              size="small"
              sx={{ mr: 2, fontWeight: 600 }}
            />
            <Button
              color="inherit"
              startIcon={<SwapIcon />}
              onClick={handleLogout}
              size="small"
            >
              Trocar Perfil
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
