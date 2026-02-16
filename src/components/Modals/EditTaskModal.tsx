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
import type { Task, UpdateTaskPayload, ClassEntity, TaskStatus } from '../../types';

interface EditTaskModalProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSubmit: (taskId: string, payload: UpdateTaskPayload) => Promise<void>;
  classes: ClassEntity[];
}

const EditTaskModal = ({ open, task, onClose, onSubmit, classes }: EditTaskModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [classId, setClassId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task && open) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setClassId(task.classId || '');
      setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : '');
      setError('');
    }
  }, [task, open]);

  const handleSubmit = async () => {
    if (!task) return;
    if (!title.trim()) {
      setError('Título é obrigatório');
      return;
    }
    setLoading(true);
    try {
      await onSubmit(task._id, {
        title: title.trim(),
        description: description.trim(),
        status,
        classId: classId || null,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      });
      onClose();
    } catch {
      setError('Erro ao atualizar tarefa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Tarefa</DialogTitle>
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
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            label="Status"
          >
            <MenuItem value="TODO">📋 A Fazer</MenuItem>
            <MenuItem value="DOING">🔄 Fazendo</MenuItem>
            <MenuItem value="DONE">✅ Concluído</MenuItem>
          </Select>
        </FormControl>
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
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTaskModal;
