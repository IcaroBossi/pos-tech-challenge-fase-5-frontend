import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  TextField,
  Button,
  Divider,
  Paper,
  Breadcrumbs,
  Link as MuiLink,
  Avatar,
} from '@mui/material';
import { ArrowBack as BackIcon, Send as SendIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import * as questionsApi from '../../api/questions.api';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import type { Question, Reply } from '../../types';

const statusConfig: Record<string, { label: string; color: 'warning' | 'info' | 'success' }> = {
  OPEN: { label: '🟡 Aberta', color: 'warning' },
  ANSWERED: { label: '🔵 Respondida', color: 'info' },
  RESOLVED: { label: '🟢 Resolvida', color: 'success' },
};

const TeacherQuestionDetail = () => {
  const { classId, questionId } = useParams<{ classId: string; questionId: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [question, setQuestion] = useState<Question | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [sending, setSending] = useState(false);

  const loadData = async () => {
    if (!classId || !questionId) return;
    setLoading(true);
    try {
      const [qs, rs] = await Promise.all([
        questionsApi.listQuestions(classId),
        questionsApi.listReplies(questionId),
      ]);
      const q = qs.find((x) => x._id === questionId) || null;
      setQuestion(q);
      setReplies(rs);
    } catch {
      enqueueSnackbar('Erro ao carregar dúvida.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [classId, questionId]);

  const handleReply = async () => {
    if (!replyContent.trim() || !questionId) return;
    setSending(true);
    try {
      await questionsApi.createReply(questionId, { content: replyContent.trim() });
      enqueueSnackbar('Resposta enviada!', { variant: 'success' });
      setReplyContent('');
      loadData();
    } catch {
      enqueueSnackbar('Erro ao enviar resposta.', { variant: 'error' });
    } finally {
      setSending(false);
    }
  };

  const getStudentName = (q: Question) => {
    if (typeof q.studentId === 'object' && q.studentId?.name) return q.studentId.name;
    return 'Aluno';
  };

  const getTeacherName = (r: Reply) => {
    if (typeof r.teacherId === 'object' && r.teacherId?.name) return r.teacherId.name;
    return 'Professor';
  };

  if (loading) return <LoadingSpinner />;
  if (!question) return <Typography>Dúvida não encontrada.</Typography>;

  const cfg = statusConfig[question.status] || statusConfig.OPEN;

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <MuiLink
          component="button"
          underline="hover"
          onClick={() => navigate('/teacher/classes')}
        >
          Turmas
        </MuiLink>
        <MuiLink
          component="button"
          underline="hover"
          onClick={() => navigate(`/teacher/classes/${classId}/questions`)}
        >
          Dúvidas
        </MuiLink>
        <Typography color="text.primary">Detalhe</Typography>
      </Breadcrumbs>

      <Button
        startIcon={<BackIcon />}
        onClick={() => navigate(`/teacher/classes/${classId}/questions`)}
        sx={{ mb: 2 }}
      >
        Voltar
      </Button>

      {/* Pergunta */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h5">{question.title}</Typography>
            <Chip label={cfg.label} color={cfg.color} size="small" />
          </Box>
          <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
            {question.description}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Perguntado por {getStudentName(question)} em{' '}
            {new Date(question.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 3 }} />

      {/* Respostas */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Respostas ({replies.length})
      </Typography>

      {replies.map((r) => (
        <Paper key={r._id} sx={{ p: 2, mb: 2, bgcolor: '#e3f2fd' }} variant="outlined">
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: '0.85rem' }}>
              P
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2">{getTeacherName(r)}</Typography>
              <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
                {r.content}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {new Date(r.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
            </Box>
          </Box>
        </Paper>
      ))}

      {/* Campo para responder */}
      <Paper sx={{ p: 2, mt: 2 }} variant="outlined">
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Responder esta dúvida
        </Typography>
        <TextField
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          multiline
          rows={3}
          fullWidth
          placeholder="Digite sua resposta..."
          inputProps={{ maxLength: 5000 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleReply}
            disabled={!replyContent.trim() || sending}
          >
            {sending ? 'Enviando...' : 'Enviar Resposta'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default TeacherQuestionDetail;
