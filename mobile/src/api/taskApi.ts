import client from './client';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '../types/task';

interface TaskResponse {
  success: boolean;
  data: Task;
}

interface TasksResponse {
  success: boolean;
  data: Task[];
}

export const taskApi = {
  getTasks: () => client.get<TasksResponse>('/tasks'),

  createTask: (payload: CreateTaskPayload) =>
    client.post<TaskResponse>('/tasks', payload),

  getTask: (id: string) => client.get<TaskResponse>(`/tasks/${id}`),

  updateTask: (id: string, payload: UpdateTaskPayload) =>
    client.put<TaskResponse>(`/tasks/${id}`, payload),

  toggleTask: (id: string) =>
    client.patch<TaskResponse>(`/tasks/${id}/toggle`),

  deleteTask: (id: string) =>
    client.delete<{ success: boolean; message: string }>(`/tasks/${id}`),
};
