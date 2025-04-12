import { Document, Types } from "mongoose";

export interface UserLocked {
  accountLocked: boolean;
  lockTimeLeft: number;
}
export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName?: string;
  email: string;
  password?: string;
  role?: "admin" | "manager" | "member";
  oAuthProfileId?: string;
  provider?: string;
  failedLoginAttempts?: number;
  lockUntil?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  isLocked(): UserLocked;
}
