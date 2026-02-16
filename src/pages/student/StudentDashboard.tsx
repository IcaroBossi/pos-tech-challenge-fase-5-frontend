import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CardActionArea } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { School as SchoolIcon, QuestionAnswer as QAIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { listClasses } from '../../api/classes.api';
import type { ClassEntity } from '../../types';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const c = await listClasses();
        setClasses(c);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        🎓 Dashboard do Aluno
      </Typography>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ bgcolor: '#e3f2fd' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <SchoolIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {loading ? '—' : classes.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Turmas Matriculadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Atalhos */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Acesso Rápido
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardActionArea onClick={() => navigate('/student/classes')} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SchoolIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6">Minhas Turmas</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Veja suas turmas e entre em novas ({classes.length} turmas)
                  </Typography>
                </Box>
              </Box>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
