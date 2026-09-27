export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  dateTime?: string;
  deadline?: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  dateTime?: string;
  deadline?: string;
  priority: Priority;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  dateTime?: string;
  deadline?: string;
  priority?: Priority;
  completed?: boolean;
}
