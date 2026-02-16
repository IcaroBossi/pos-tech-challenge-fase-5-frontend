import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import type { CreateQuestionPayload } from '../../types';

interface CreateQuestionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateQuestionPayload) => Promise<void>;
}

const CreateQuestionModal = ({ open, onClose, onSubmit }: CreateQuestionModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [descError, setDescError] = useState('');

  useEffect(() => {
    if (open) {
      setTitle('');
      setDescription('');
      setTitleError('');
      setDescError('');
    }
  }, [open]);

  const handleSubmit = async () => {
    let valid = true;
    if (!title.trim()) {
      setTitleError('Título é obrigatório');
      valid = false;
    }
    if (!description.trim()) {
      setDescError('Descrição é obrigatória');
      valid = false;
    }
    if (!valid) return;

    setLoading(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim() });
      onClose();
    } catch {
      setDescError('Erro ao criar dúvida.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Nova Dúvida</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField
          label="Título"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleError('');
          }}
          required
          error={!!titleError}
          helperText={titleError}
          autoFocus
          fullWidth
          inputProps={{ maxLength: 200 }}
        />
        <TextField
          label="Descrição"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setDescError('');
          }}
          required
          error={!!descError}
          helperText={descError}
          multiline
          rows={4}
          fullWidth
          inputProps={{ maxLength: 5000 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Dúvida'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateQuestionModal;
