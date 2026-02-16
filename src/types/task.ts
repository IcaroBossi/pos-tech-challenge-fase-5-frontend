export type TaskStatus = 'TODO' | 'DOING' | 'DONE';

export interface Task {
  _id: string;
  teacherId: string;
  classId: string | null;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  classId?: string | null;
  dueDate?: string | null;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  classId?: string | null;
  dueDate?: string | null;
}
