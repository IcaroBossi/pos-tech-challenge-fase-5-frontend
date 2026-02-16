import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Button,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import { ArrowBack as BackIcon, Add as AddIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import * as questionsApi from '../../api/questions.api';
import * as classesApi from '../../api/classes.api';
import CreateQuestionModal from '../../components/Modals/CreateQuestionModal';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import EmptyState from '../../components/EmptyState/EmptyState';
import type { Question, ClassEntity, CreateQuestionPayload } from '../../types';

const statusConfig: Record<string, { label: string; color: 'warning' | 'info' | 'success' }> = {
  OPEN: { label: '🟡 Aberta', color: 'warning' },
  ANSWERED: { label: '🔵 Respondida', color: 'info' },
  RESOLVED: { label: '🟢 Resolvida', color: 'success' },
};

const StudentClassQuestions = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [cls, setCls] = useState<ClassEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  const loadData = async () => {
    if (!classId) return;
    setLoading(true);
    try {
      const [q, c] = await Promise.all([
        questionsApi.listQuestions(classId),
        classesApi.getClass(classId),
      ]);
      setQuestions(q);
      setCls(c);
    } catch {
      enqueueSnackbar('Erro ao carregar dúvidas.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [classId]);

  const handleCreate = async (payload: CreateQuestionPayload) => {
    if (!classId) return;
    await questionsApi.createQuestion(classId, payload);
    enqueueSnackbar('Dúvida criada com sucesso!', { variant: 'success' });
    loadData();
  };

  const getStudentName = (q: Question) => {
    if (typeof q.studentId === 'object' && q.studentId?.name) return q.studentId.name;
    return 'Aluno';
  };

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <MuiLink
          component="button"
          underline="hover"
          onClick={() => navigate('/student/classes')}
          sx={{ cursor: 'pointer' }}
        >
          Turmas
        </MuiLink>
        <Typography color="text.primary">{cls?.name || '...'}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/student/classes')}>
            Voltar
          </Button>
          <Typography variant="h4">
            💬 Dúvidas — {cls?.name || '...'}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          Nova Dúvida
        </Button>
      </Box>

      {loading ? (
        <LoadingSpinner />
      ) : questions.length === 0 ? (
        <EmptyState message="Nenhuma dúvida nesta turma. Seja o primeiro a perguntar!" />
      ) : (
        questions.map((q) => {
          const cfg = statusConfig[q.status] || statusConfig.OPEN;
          return (
            <Card key={q._id} sx={{ mb: 2 }}>
              <CardActionArea
                onClick={() => navigate(`/student/classes/${classId}/questions/${q._id}`)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6">{q.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        por {getStudentName(q)} •{' '}
                        {new Date(q.createdAt).toLocaleDateString('pt-BR')}
                      </Typography>
                    </Box>
                    <Chip label={cfg.label} color={cfg.color} size="small" />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })
      )}

      <CreateQuestionModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />
    </Box>
  );
};

export default StudentClassQuestions;
