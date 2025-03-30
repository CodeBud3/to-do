import { Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  matrix: "urgent-important" | "not-urgent-important" | "urgent-not-important" | "not-urgent-not-important";
  status: "todo" | "in-progress" | "done";
  due_date?: Date;
  stack_rank: number;
  user_id: string;
  tag: "work" | "personal" | "errand" | "other";
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
