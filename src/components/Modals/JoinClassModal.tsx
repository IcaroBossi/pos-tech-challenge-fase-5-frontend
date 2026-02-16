import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

interface JoinClassModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (joinCode: string) => Promise<void>;
}

const JoinClassModal = ({ open, onClose, onSubmit }: JoinClassModalProps) => {
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setJoinCode('');
      setError('');
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!joinCode.trim()) {
      setError('Código é obrigatório');
      return;
    }
    setLoading(true);
    try {
      await onSubmit(joinCode.trim());
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || 'Erro ao entrar na turma.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Entrar em Turma</DialogTitle>
      <DialogContent sx={{ mt: 1 }}>
        <TextField
          label="Código da Turma (joinCode)"
          value={joinCode}
          onChange={(e) => {
            setJoinCode(e.target.value.toUpperCase());
            setError('');
          }}
          required
          error={!!error}
          helperText={error}
          autoFocus
          fullWidth
          inputProps={{ maxLength: 10 }}
          placeholder="Ex: TURMA1"
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JoinClassModal;
