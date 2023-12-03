import mongoose from "mongoose";

export interface User {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: Date;
  role: "Trainer" | "Athlete";
}

export interface Trainer extends User {
  background: string;
  speciality: string;
}

export interface Athlete extends User {
  height: number;
  weight: number;
  level: "Beginner" | "Intermediate" | "Advanced";
}

const userSchema = new mongoose.Schema<User>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    dob: Date,
    role: {
      type: String,
      enum: ["Trainer", "Athlete"],
    },
  },
  { collection: "user", discriminatorKey: "role" }
);

export const userModel = mongoose.model<User>("user", userSchema);

export const trainerModel = userModel.discriminator<Trainer>(
  "Trainer",
  new mongoose.Schema({
    background: String,
    speciality: String,
  })
);

export const athleteModel = userModel.discriminator<Athlete>(
  "Athlete",
  new mongoose.Schema({
    height: Number,
    weight: Number,
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
  })
);

