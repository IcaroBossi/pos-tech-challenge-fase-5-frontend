export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'TEACHER' | 'STUDENT';
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export type DemoProfile = 'teacher' | 'student';
