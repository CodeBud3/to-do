import mongoose, { Schema } from "mongoose";
import { ITask } from "../types/task.types";
import { applyTransform } from "../../../helpers/mongooseTransform";

const taskSchema = new Schema(
  {
    fields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    userId: {
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
      { userId: 1 },
      { userId: 1, sequence_num: 1 },
      { userId: 1, fields: 1 },
    ],
  }
);
applyTransform(taskSchema);
export const Task = mongoose.model<ITask>("Task", taskSchema);
