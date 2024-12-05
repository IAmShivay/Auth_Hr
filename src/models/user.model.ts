import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid"; // Make sure to install this package: npm install uuid

export interface IUser extends mongoose.Document {
  fullName?: string;
  terms: boolean;
  companyName?: string;
  email: string;
  password: string;
  mobile?: string;
  companyId: string; // Add this line
  role: string;
  roleId?: string;
  employeeId: string;
  permissions?: string[];
  status?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    employeeId: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    companyId: {
      type: String,
      default: uuidv4,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      default: "active",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    permissions: {
      type: [String],
    },
    mobile: {
      type: String,
      trim: true,
    },
    roleId: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "Company",
      required: true,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
