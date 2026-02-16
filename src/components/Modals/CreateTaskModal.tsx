import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { ClassEntity, CreateTaskPayload } from '../../types';

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTaskPayload) => Promise<void>;
  classes: ClassEntity[];
}

const CreateTaskModal = ({ open, onClose, onSubmit, classes }: CreateTaskModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classId, setClassId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setTitle('');
      setDescription('');
      setClassId('');
      setDueDate('');
      setError('');
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Título é obrigatório');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        classId: classId || null,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      });
      onClose();
    } catch {
      setError('Erro ao criar tarefa. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Nova Tarefa</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          error={!!error && !title.trim()}
          helperText={!title.trim() && error ? error : ''}
          autoFocus
          fullWidth
          inputProps={{ maxLength: 200 }}
        />
        <TextField
          label="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          fullWidth
          inputProps={{ maxLength: 2000 }}
        />
        <FormControl fullWidth>
          <InputLabel>Turma (opcional)</InputLabel>
          <Select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            label="Turma (opcional)"
          >
            <MenuItem value="">Nenhuma (Geral)</MenuItem>
            {classes.map((c) => (
              <MenuItem key={c._id} value={c._id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Data limite"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Criando...' : 'Criar Tarefa'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTaskModal;
