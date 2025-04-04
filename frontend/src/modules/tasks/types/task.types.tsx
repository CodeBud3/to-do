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
