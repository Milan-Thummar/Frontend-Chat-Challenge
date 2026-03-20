export interface Message {
  _id?: string;
  author: string;
  message: string;
  createdAt: string;
}

export interface GetMessagesParams {
  limit?: number;
  before?: string;
  after?: string;
}
