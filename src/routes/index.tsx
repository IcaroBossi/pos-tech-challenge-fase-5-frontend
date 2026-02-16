import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import ChooseProfile from '../pages/ChooseProfile';
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import TeacherTasks from '../pages/teacher/TeacherTasks';
import TeacherClasses from '../pages/teacher/TeacherClasses';
import TeacherClassQuestions from '../pages/teacher/TeacherClassQuestions';
import TeacherQuestionDetail from '../pages/teacher/QuestionDetail';
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentClasses from '../pages/student/StudentClasses';
import StudentClassQuestions from '../pages/student/StudentClassQuestions';
import StudentQuestionDetail from '../pages/student/QuestionDetail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ChooseProfile />,
  },
  {
    path: '/teacher',
    element: (
      <ProtectedRoute allowedProfile="teacher">
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <TeacherDashboard /> },
      { path: 'tasks', element: <TeacherTasks /> },
      { path: 'classes', element: <TeacherClasses /> },
      { path: 'classes/:classId/questions', element: <TeacherClassQuestions /> },
      { path: 'classes/:classId/questions/:questionId', element: <TeacherQuestionDetail /> },
    ],
  },
  {
    path: '/student',
    element: (
      <ProtectedRoute allowedProfile="student">
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <StudentDashboard /> },
      { path: 'classes', element: <StudentClasses /> },
      { path: 'classes/:classId/questions', element: <StudentClassQuestions /> },
      { path: 'classes/:classId/questions/:questionId', element: <StudentQuestionDetail /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
