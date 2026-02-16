import { Paper, Typography, Box } from '@mui/material';
import type { Task, TaskStatus, ClassEntity } from '../../types';
import TaskCard from './TaskCard';
import { useDroppable, useDraggable } from '@dnd-kit/core';

/* Wrapper draggable para cada card */
const DraggableCard = ({
  task,
  classes,
  onEdit,
  onDelete,
}: {
  task: Task;
  classes: ClassEntity[];
  onEdit: (t: Task) => void;
  onDelete: (t: Task) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
  });
  const style: React.CSSProperties = {
    ...(transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : {}),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : undefined,
  };
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <TaskCard task={task} classes={classes} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
};

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  emoji: string;
  tasks: Task[];
  classes: ClassEntity[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const KanbanColumn = ({
  status,
  title,
  emoji,
  tasks,
  classes,
  onEdit,
  onDelete,
}: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        flex: 1,
        minWidth: 280,
        maxWidth: 400,
        bgcolor: isOver ? 'action.hover' : 'grey.50',
        p: 2,
        minHeight: 400,
        transition: 'background-color 0.2s',
        display: 'flex',
        flexDirection: 'column',
      }}
      elevation={0}
      variant="outlined"
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontSize: '1rem' }}>
          {emoji} {title}
        </Typography>
        <Box
          sx={{
            ml: 1,
            bgcolor: 'primary.main',
            color: 'white',
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          {tasks.length}
        </Box>
      </Box>
      <Box sx={{ flex: 1 }}>
        {tasks.map((task) => (
          <DraggableCard
            key={task._id}
            task={task}
            classes={classes}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default KanbanColumn;
