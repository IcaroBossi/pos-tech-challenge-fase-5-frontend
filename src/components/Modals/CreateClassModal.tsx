import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

interface CreateClassModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

const CreateClassModal = ({ open, onClose, onSubmit }: CreateClassModalProps) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setName('');
      setError('');
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Nome da turma é obrigatório');
      return;
    }
    setLoading(true);
    try {
      await onSubmit(name.trim());
      onClose();
    } catch {
      setError('Erro ao criar turma.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Criar Nova Turma</DialogTitle>
      <DialogContent sx={{ mt: 1 }}>
        <TextField
          label="Nome da Turma"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          error={!!error}
          helperText={error}
          autoFocus
          fullWidth
          inputProps={{ maxLength: 100 }}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Criando...' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateClassModal;
