export interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  due_date: string;
  stack_rank: number;
  user_id: string;
  tags: string[];
}

export interface TaskResponse {
  data: Task;
}

export interface TaskDataResponse {
  tasks: Task[];
}

export interface GetTaskResponse {
  data: TaskDataResponse;
}
