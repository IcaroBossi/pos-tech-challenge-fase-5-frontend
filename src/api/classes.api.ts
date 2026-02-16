import api from './axios';
import type { ClassEntity } from '../types';

export const listClasses = async (): Promise<ClassEntity[]> => {
  const { data } = await api.get<{ data: ClassEntity[] }>('/classes');
  return data.data;
};

export const getClass = async (classId: string): Promise<ClassEntity> => {
  const { data } = await api.get<{ data: ClassEntity }>(`/classes/${classId}`);
  return data.data;
};

export const createClass = async (name: string): Promise<ClassEntity> => {
  const { data } = await api.post<{ data: ClassEntity }>('/classes', { name });
  return data.data;
};

export const joinClass = async (joinCode: string): Promise<ClassEntity> => {
  const { data } = await api.post<{ data: ClassEntity }>('/classes/join', { joinCode });
  return data.data;
};
