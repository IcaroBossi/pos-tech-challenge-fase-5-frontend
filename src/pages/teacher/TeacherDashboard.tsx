import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CardActionArea } from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  ViewKanban as KanbanIcon,
  School as SchoolIcon,
  Assignment as TaskIcon,
  QuestionAnswer as QAIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { listTasks } from '../../api/tasks.api';
import { listClasses } from '../../api/classes.api';
import type { Task, ClassEntity } from '../../types';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, c] = await Promise.all([listTasks(), listClasses()]);
        setTasks(t);
        setClasses(c);
      } catch {
        // silently fail on dashboard
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const todoCount = tasks.filter((t) => t.status === 'TODO').length;
  const doingCount = tasks.filter((t) => t.status === 'DOING').length;
  const doneCount = tasks.filter((t) => t.status === 'DONE').length;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        👩‍🏫 Dashboard do Professor
      </Typography>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ bgcolor: '#e3f2fd' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TaskIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {loading ? '—' : tasks.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de Tarefas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ bgcolor: '#fff3e0' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#e65100' }}>
                {loading ? '—' : todoCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                📋 A Fazer
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ bgcolor: '#e8f5e9' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                {loading ? '—' : doingCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                🔄 Fazendo
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ bgcolor: '#f3e5f5' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#7b1fa2' }}>
                {loading ? '—' : doneCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ✅ Concluído
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
            <CardActionArea onClick={() => navigate('/teacher/tasks')} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <KanbanIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6">Minhas Tarefas</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Gerencie suas tarefas no quadro Kanban
                  </Typography>
                </Box>
              </Box>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardActionArea onClick={() => navigate('/teacher/classes')} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SchoolIcon sx={{ fontSize: 48, color: 'secondary.main' }} />
                <Box>
                  <Typography variant="h6">Minhas Turmas</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Veja turmas e responda dúvidas ({classes.length} turmas)
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

export default TeacherDashboard;
