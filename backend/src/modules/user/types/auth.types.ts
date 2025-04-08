import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName?: string;
  email: string;
  password?: string;
  role?: "admin" | "manager" | "member";
  oAuthProfileId?: string;
  provider?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
