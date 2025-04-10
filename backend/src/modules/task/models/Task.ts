import mongoose, { Schema } from "mongoose";
import { ITask } from "../types/task.types";

const taskSchema = new Schema(
  {
    fields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Add index for better query performance
    },
    sequence_num: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    // Add compound index for efficient user-specific ordering
    // This helps when querying tasks for a specific user with sorting
    indexes: [
      { user_id: 1, sequence_num: 1 },
      { user_id: 1, fields: 1 },
    ],
  }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);
