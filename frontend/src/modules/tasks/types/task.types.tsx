export type FieldType = string | string[] | number | boolean;
export interface Task {
  id: string;
  fields: { [key: string]: FieldType };
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
