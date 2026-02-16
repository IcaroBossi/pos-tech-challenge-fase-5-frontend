import { Box, Button, Card, CardContent, Typography, Container, Stack } from '@mui/material';
import { School as SchoolIcon, Person as PersonIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useEffect } from 'react';

const ChooseProfile = () => {
  const { login, profile } = useAuth();
  const navigate = useNavigate();

  // Se já logado, redireciona
  useEffect(() => {
    if (profile === 'teacher') navigate('/teacher', { replace: true });
    if (profile === 'student') navigate('/student', { replace: true });
  }, [profile, navigate]);

  const handleSelect = (p: 'teacher' | 'student') => {
    login(p);
    navigate(p === 'teacher' ? '/teacher' : '/student');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
            📋 TurmaBoard
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)' }}>
            Sistema de gestão de tarefas e dúvidas para o ensino público
          </Typography>
        </Box>

        <Card sx={{ p: 2 }}>
          <CardContent>
            <Typography variant="h5" align="center" sx={{ mb: 3 }}>
              Escolha seu perfil
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<SchoolIcon />}
                onClick={() => handleSelect('teacher')}
                sx={{
                  py: 3,
                  fontSize: '1.1rem',
                  bgcolor: '#1565c0',
                  '&:hover': { bgcolor: '#0d47a1' },
                }}
              >
                Entrar como Professor
              </Button>

              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<PersonIcon />}
                onClick={() => handleSelect('student')}
                sx={{
                  py: 3,
                  fontSize: '1.1rem',
                  bgcolor: '#f9a825',
                  color: '#000',
                  '&:hover': { bgcolor: '#f57f17' },
                }}
              >
                Entrar como Aluno
              </Button>
            </Stack>

            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
              sx={{ mt: 3 }}
            >
              Esta é uma versão demo. Nenhuma autenticação real é necessária.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ChooseProfile;
