import mongoose, { Schema, Types } from "mongoose";

export type Workout = {
  _id: string;
  title: string;
  description: string;
  level: Level;
  post_date: Date;
  steps: WorkoutStep[];
  trainer: Types.ObjectId;
};

export type WorkoutStep = {
  exercise: Exercise;
  sets: number;
  reps: number;
  rest: number;
};

export type Exercise = {
  name: string;
  targetMuscle: string;
  equipment: string;
  gifUrl: string;
};

export type Level = "Beginner" | "Intermediate" | "Advanced";

const workoutSchema = new mongoose.Schema<Workout>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    post_date: { type: Date, required: true },
    steps: [
      {
        exercise: {
          name: { type: String, required: true },
          targetMuscle: { type: String, required: true },
          equipment: { type: String, required: true },
          gifUrl: { type: String, required: true },
        },
        sets: { type: Number, required: true },
        reps: { type: Number, required: true },
        rest: { type: Number, required: true },
      },
    ],
    trainer: { type: Schema.Types.ObjectId, ref: "user" },
  },
  {
    collection: "workout",
  }
);

export const workoutModel = mongoose.model<Workout>("workout", workoutSchema);
