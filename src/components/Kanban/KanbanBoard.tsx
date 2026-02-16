import { Box } from '@mui/material';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { useState } from 'react';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import type { Task, TaskStatus, ClassEntity } from '../../types';

interface KanbanBoardProps {
  tasks: Task[];
  classes: ClassEntity[];
  onMoveTask: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const columns: { status: TaskStatus; title: string; emoji: string }[] = [
  { status: 'TODO', title: 'A Fazer', emoji: '📋' },
  { status: 'DOING', title: 'Fazendo', emoji: '🔄' },
  { status: 'DONE', title: 'Concluído', emoji: '✅' },
];

const KanbanBoard = ({ tasks, classes, onMoveTask, onEdit, onDelete }: KanbanBoardProps) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t._id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    const task = tasks.find((t) => t._id === taskId);
    if (task && task.status !== newStatus) {
      onMoveTask(taskId, newStatus);
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
        {columns.map((col) => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            title={col.title}
            emoji={col.emoji}
            tasks={tasks.filter((t) => t.status === col.status)}
            classes={classes}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </Box>
      <DragOverlay>
        {activeTask && (
          <TaskCard task={activeTask} classes={classes} onEdit={() => {}} onDelete={() => {}} />
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
