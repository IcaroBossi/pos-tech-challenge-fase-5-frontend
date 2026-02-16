import api from './axios';
import type { Question, QuestionStatus, CreateQuestionPayload, Reply, CreateReplyPayload } from '../types';

/* ─── Questions ─── */

export const listQuestions = async (classId: string): Promise<Question[]> => {
  const { data } = await api.get<{ data: Question[] }>(`/classes/${classId}/questions`);
  return data.data;
};

export const createQuestion = async (classId: string, payload: CreateQuestionPayload): Promise<Question> => {
  const { data } = await api.post<{ data: Question }>(`/classes/${classId}/questions`, payload);
  return data.data;
};

export const updateQuestionStatus = async (
  questionId: string,
  status: QuestionStatus,
): Promise<Question> => {
  const { data } = await api.patch<{ data: Question }>(`/questions/${questionId}`, { status });
  return data.data;
};

/* ─── Replies ─── */

export const listReplies = async (questionId: string): Promise<Reply[]> => {
  const { data } = await api.get<{ data: Reply[] }>(`/questions/${questionId}/replies`);
  return data.data;
};

export const createReply = async (questionId: string, payload: CreateReplyPayload): Promise<Reply> => {
  const { data } = await api.post<{ data: Reply }>(`/questions/${questionId}/replies`, payload);
  return data.data;
};
