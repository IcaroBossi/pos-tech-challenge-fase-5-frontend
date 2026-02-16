import api from './axios';
import type { Task, CreateTaskPayload, UpdateTaskPayload, TaskStatus } from '../types';

interface ListTasksParams {
  classId?: string;
  status?: TaskStatus;
}

export const listTasks = async (params?: ListTasksParams): Promise<Task[]> => {
  const { data } = await api.get<{ data: Task[] }>('/tasks', { params });
  return data.data;
};

export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  const { data } = await api.post<{ data: Task }>('/tasks', payload);
  return data.data;
};

export const updateTask = async (taskId: string, payload: UpdateTaskPayload): Promise<Task> => {
  const { data } = await api.patch<{ data: Task }>(`/tasks/${taskId}`, payload);
  return data.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await api.delete(`/tasks/${taskId}`);
};
