import { Document } from "mongoose";

export type FieldType = string | string[] | number | boolean;
export interface ITask extends Document {
  fields: { [key: string]: FieldType };
  userId: string;
  sequence_num: number;
  createdAt: Date;
  updatedAt: Date;
}

// Response type for better documentation
export interface TaskResponse {
  success: boolean;
  data?: ITask | ITask[] | null;
  message?: string;
  error?: any;
}
