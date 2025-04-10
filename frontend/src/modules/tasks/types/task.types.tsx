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

export interface TaskDataResponse {
  tasks: Task[];
}

export interface GetTaskResponse {
  data: TaskDataResponse;
}
