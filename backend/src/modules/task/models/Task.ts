import mongoose, { Schema } from "mongoose";
import { ITask } from "../types/task.types";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    matrix: {
      type: String,
      enum: ["urgent-important", "not-urgent-important", "urgent-not-important", "not-urgent-not-important"],
      default: "not-urgent-important",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    due_date: {
      type: Date,
    },
    stack_rank: {
      type: Number,
      default: 0,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Add index for better query performance
    },
    tag: {
      type: String,
      enum: ["work", "personal", "errand", "other"],
      default: "other",
    },
    sequence_num: {
      type: Number,
      default: 0,
    }
  },
  { 
    timestamps: true,
    // Add compound index for efficient user-specific ordering
    // This helps when querying tasks for a specific user with sorting
    indexes: [
      { user_id: 1, sequence_num: 1 }
    ]
  }
);

// For optimized queries, we add a compound index
taskSchema.index({ user_id: 1, status: 1 });
taskSchema.index({ user_id: 1, priority: 1 });
taskSchema.index({ user_id: 1, tag: 1 });
taskSchema.index({ user_id: 1, due_date: 1 });

export const Task = mongoose.model<ITask>("Task", taskSchema);
