import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import * as classesApi from '../../api/classes.api';
import JoinClassModal from '../../components/Modals/JoinClassModal';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import EmptyState from '../../components/EmptyState/EmptyState';
import type { ClassEntity } from '../../types';

const StudentClasses = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinOpen, setJoinOpen] = useState(false);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const data = await classesApi.listClasses();
      setClasses(data);
    } catch {
      enqueueSnackbar('Erro ao carregar turmas.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleJoin = async (joinCode: string) => {
    await classesApi.joinClass(joinCode);
    enqueueSnackbar('Matrícula realizada com sucesso!', { variant: 'success' });
    loadClasses();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">🏫 Minhas Turmas</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setJoinOpen(true)}>
          Entrar em Turma
        </Button>
      </Box>

      {loading ? (
        <LoadingSpinner />
      ) : classes.length === 0 ? (
        <EmptyState message="Você ainda não está em nenhuma turma. Use um código para entrar!" />
      ) : (
        <Grid container spacing={2}>
          {classes.map((cls) => (
            <Grid key={cls._id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                <CardActionArea
                  onClick={() => navigate(`/student/classes/${cls._id}/questions`)}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                      {cls.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Clique para ver as dúvidas
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <JoinClassModal
        open={joinOpen}
        onClose={() => setJoinOpen(false)}
        onSubmit={handleJoin}
      />
    </Box>
  );
};

export default StudentClasses;
