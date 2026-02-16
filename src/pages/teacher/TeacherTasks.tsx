import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import KanbanBoard from '../../components/Kanban/KanbanBoard';
import CreateTaskModal from '../../components/Modals/CreateTaskModal';
import EditTaskModal from '../../components/Modals/EditTaskModal';
import ConfirmDialog from '../../components/Modals/ConfirmDialog';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import EmptyState from '../../components/EmptyState/EmptyState';
import * as tasksApi from '../../api/tasks.api';
import * as classesApi from '../../api/classes.api';
import type { Task, TaskStatus, ClassEntity, CreateTaskPayload, UpdateTaskPayload } from '../../types';

const TeacherTasks = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterClassId, setFilterClassId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Modais
  const [createOpen, setCreateOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filterClassId) params.classId = filterClassId;
      if (filterStatus) params.status = filterStatus;
      const [t, c] = await Promise.all([tasksApi.listTasks(params as any), classesApi.listClasses()]);
      setTasks(t);
      setClasses(c);
    } catch {
      enqueueSnackbar('Erro ao carregar tarefas.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [filterClassId, filterStatus, enqueueSnackbar]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (payload: CreateTaskPayload) => {
    await tasksApi.createTask(payload);
    enqueueSnackbar('Tarefa criada com sucesso!', { variant: 'success' });
    loadData();
  };

  const handleEdit = async (taskId: string, payload: UpdateTaskPayload) => {
    await tasksApi.updateTask(taskId, payload);
    enqueueSnackbar('Tarefa atualizada!', { variant: 'success' });
    loadData();
  };

  const handleDelete = async () => {
    if (!deleteTask) return;
    try {
      await tasksApi.deleteTask(deleteTask._id);
      enqueueSnackbar('Tarefa removida!', { variant: 'success' });
      setDeleteTask(null);
      loadData();
    } catch {
      enqueueSnackbar('Erro ao remover tarefa.', { variant: 'error' });
    }
  };

  const handleMoveTask = async (taskId: string, newStatus: TaskStatus) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)),
    );
    try {
      await tasksApi.updateTask(taskId, { status: newStatus });
    } catch {
      enqueueSnackbar('Erro ao mover tarefa.', { variant: 'error' });
      loadData();
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">📋 Minhas Tarefas</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          Nova Tarefa
        </Button>
      </Box>

      {/* Filtros */}
      <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Filtrar por turma</InputLabel>
          <Select
            value={filterClassId}
            onChange={(e) => setFilterClassId(e.target.value)}
            label="Filtrar por turma"
          >
            <MenuItem value="">Todas</MenuItem>
            {classes.map((c) => (
              <MenuItem key={c._id} value={c._id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Filtrar por status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Filtrar por status"
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="TODO">📋 A Fazer</MenuItem>
            <MenuItem value="DOING">🔄 Fazendo</MenuItem>
            <MenuItem value="DONE">✅ Concluído</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {loading ? (
        <LoadingSpinner />
      ) : tasks.length === 0 ? (
        <EmptyState message="Nenhuma tarefa encontrada. Crie a primeira!" />
      ) : (
        <KanbanBoard
          tasks={tasks}
          classes={classes}
          onMoveTask={handleMoveTask}
          onEdit={(task) => setEditTask(task)}
          onDelete={(task) => setDeleteTask(task)}
        />
      )}

      {/* Modais */}
      <CreateTaskModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        classes={classes}
      />
      <EditTaskModal
        open={!!editTask}
        task={editTask}
        onClose={() => setEditTask(null)}
        onSubmit={handleEdit}
        classes={classes}
      />
      <ConfirmDialog
        open={!!deleteTask}
        title="Excluir Tarefa"
        message={`Deseja realmente excluir a tarefa "${deleteTask?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTask(null)}
        confirmText="Excluir"
      />
    </Box>
  );
};

export default TeacherTasks;
