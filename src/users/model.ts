import mongoose from "mongoose";

export interface User {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: Date;
  role: "Trainer" | "Athlete";

  // Trainer properties
  background?: string;
  speciality?:
    | "Bodybuilding"
    | "Powerlifting"
    | "Crossfit"
    | "Endurance"
    | "Calisthenics";

  // Athlete properties
  height?: number;
  weight?: number;
  level?: "Beginner" | "Intermediate" | "Advanced";
}

const userSchema = new mongoose.Schema<User>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date, required: true },
    role: {
      type: String,
      required: true,
      enum: ["Trainer", "Athlete"],
    },
    background: { type: String },
    speciality: {
      type: String,
      enum: [
        "Bodybuilding",
        "Powerlifting",
        "Crossfit",
        "Endurance",
        "Calisthenics",
      ],
    },
    height: { type: Number },
    weight: { type: Number },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
  },
  { collection: "user" }
);

export const userModel = mongoose.model<User>("user", userSchema);
