import mongoose, { Schema, Types } from "mongoose";

export type Rating = {
  value: 1 | 2 | 3 | 4 | 5;
  comment: string;
  date: Date;
  athlete: Types.ObjectId;
  workout: Types.ObjectId;
};

const ratingSchema = new mongoose.Schema<Rating>(
  {
    value: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, required: true },
    athlete: { type: Schema.Types.ObjectId, ref: "user", required: true },
    workout: { type: Schema.Types.ObjectId, ref: "workout", required: true },
  },
  {
    collection: "rating",
  }
);

export const ratingModel = mongoose.model<Rating>("rating", ratingSchema);
