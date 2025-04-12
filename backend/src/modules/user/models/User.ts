import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, UserLocked } from "../types/auth.types";
import { MAX_NO_OF_LOGIN_ATTEMPTS } from "../../auth/constants/auth.constants";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "manager", "member"],
      default: "member",
    },
    auth_token: {
      type: String,
      default: null,
    },
    oAuthProfileId: {
      type: String,
      default: null,
    },
    provider: {
      type: String,
      enum: ["google", "microsoft", "apple"],
      default: null,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.failedLoginAttempts = 0;
    this.lockUntil = undefined;
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.isLocked = function (): UserLocked {
  if (this.failedLoginAttempts >= MAX_NO_OF_LOGIN_ATTEMPTS) {
    const lockTimeLeft = Math.round(
      (this.lockUntil.getTime() - Date.now()) / 1000
    );
    return { accountLocked: true, lockTimeLeft };
  }
  return { accountLocked: false, lockTimeLeft: 0 };
};

export const User = mongoose.model<IUser>("User", userSchema);
