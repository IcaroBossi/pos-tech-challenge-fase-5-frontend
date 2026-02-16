import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import type { Task, ClassEntity } from '../../types';

interface TaskCardProps {
  task: Task;
  classes: ClassEntity[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const TaskCard = ({ task, classes, onEdit, onDelete }: TaskCardProps) => {
  const linkedClass = classes.find((c) => c._id === task.classId);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <Card
      sx={{
        mb: 1.5,
        cursor: 'grab',
        '&:hover': { boxShadow: 4 },
        transition: 'box-shadow 0.2s',
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
            {task.title}
          </Typography>
          <Box sx={{ display: 'flex', ml: 1 }}>
            <Tooltip title="Editar">
              <IconButton size="small" onClick={() => onEdit(task)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Excluir">
              <IconButton size="small" color="error" onClick={() => onDelete(task)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }} noWrap>
            {task.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
          {linkedClass && (
            <Chip label={linkedClass.name} size="small" color="primary" variant="outlined" />
          )}
          {task.dueDate && (
            <Chip
              icon={<CalendarIcon sx={{ fontSize: 14 }} />}
              label={formatDate(task.dueDate)}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
