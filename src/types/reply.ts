export interface Reply {
  _id: string;
  questionId: string;
  teacherId:
    | string
    | {
        _id: string;
        name: string;
        email: string;
      };
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReplyPayload {
  content: string;
}
