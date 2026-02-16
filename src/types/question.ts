export type QuestionStatus = 'OPEN' | 'ANSWERED' | 'RESOLVED';

export interface Question {
  _id: string;
  classId: string;
  studentId:
    | string
    | {
        _id: string;
        name: string;
        email: string;
      };
  title: string;
  description: string;
  status: QuestionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionPayload {
  title: string;
  description: string;
}
