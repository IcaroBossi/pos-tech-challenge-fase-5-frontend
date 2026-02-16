import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActionArea,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Add as AddIcon, ContentCopy as CopyIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import * as classesApi from '../../api/classes.api';
import CreateClassModal from '../../components/Modals/CreateClassModal';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import EmptyState from '../../components/EmptyState/EmptyState';
import type { ClassEntity } from '../../types';

const TeacherClasses = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

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

  const handleCreate = async (name: string) => {
    await classesApi.createClass(name);
    enqueueSnackbar('Turma criada com sucesso!', { variant: 'success' });
    loadClasses();
  };

  const copyJoinCode = (code: string) => {
    navigator.clipboard.writeText(code);
    enqueueSnackbar(`Código "${code}" copiado!`, { variant: 'info' });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">🏫 Minhas Turmas</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          Criar Turma
        </Button>
      </Box>

      {loading ? (
        <LoadingSpinner />
      ) : classes.length === 0 ? (
        <EmptyState message="Nenhuma turma criada ainda." />
      ) : (
        <Grid container spacing={2}>
          {classes.map((cls) => (
            <Grid key={cls._id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                <CardActionArea
                  onClick={() => navigate(`/teacher/classes/${cls._id}/questions`)}
                  sx={{ p: 0 }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {cls.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={`Código: ${cls.joinCode}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Criada em {new Date(cls.createdAt).toLocaleDateString('pt-BR')}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <Box sx={{ px: 2, pb: 1 }}>
                  <Button
                    size="small"
                    startIcon={<CopyIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      copyJoinCode(cls.joinCode);
                    }}
                  >
                    Copiar Código
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <CreateClassModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />
    </Box>
  );
};

export default TeacherClasses;
