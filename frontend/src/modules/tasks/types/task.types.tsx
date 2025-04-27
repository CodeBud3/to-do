export type FieldType = string | string[] | number | boolean;

export type TaskField = { [key: string]: FieldType };
export interface Task {
  id: string;
  fields: TaskField;
  sequence_num: number;
}

export interface TaskResponse {
  data: Task;
}

export interface TaskColumn {
  id: string;
  title: string;
  key: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  tasks: Task[];
  count: number;
}

export interface TaskDataResponse {
  tasks: Task[];
  viewType?: 'list' | 'kanban';
  columns?: TaskColumn[];
  groupedTasks?: { [key: string]: KanbanColumn };
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
}

export interface GetTaskResponse {
  data: TaskDataResponse;
}
