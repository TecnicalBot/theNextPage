import { IUser, PlanType } from "@/types/user";
import mongoose, { Document, Schema } from "mongoose";

export interface IUserSchema extends IUser, Document {
  credits: number;
  creditsExpiry?: Date;
  failedAttempts: number;
  blockAccount: boolean;
  refreshToken?: string;
  otp?: number;
  plan: PlanType;
  otpExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUserSchema>(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    credits: {
      type: Number,
      default: 15,
      required: true,
    },
    creditsExpiry: {
      type: Date,
      default: Date.now() + 24 * 60 * 60 * 1000,
    },
    plan: {
      type: String,
      enum: Object.values(PlanType),
      default: PlanType.Free,
      required: true,
    },
    failedAttempts: {
      type: Number,
      max: 3,
      default: 0,
    },
    blockAccount: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    otp: {
      type: Number,
    },
    otpExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User || mongoose.model<IUserSchema>("User", UserSchema);

export default User;
