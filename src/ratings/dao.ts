import { User } from "../users/model";
import { removeId } from "../util";
import { Workout, workoutModel } from "../workouts/model";
import { Rating, ratingModel } from "./model";

export async function createRating(
  workoutId: string,
  athleteId: string,
  rating: Rating
) {
  const workout = await workoutModel.findById(workoutId);
  if (workout === null) {
    return "WorkoutNotFound";
  }

  const previousWorkout = await ratingModel.findOne({
    workout: workoutId,
    athlete: athleteId,
  });
  if (previousWorkout !== null) {
    return "AlreadyRated";
  }

  const payload = removeId(rating);
  payload.athlete = athleteId;
  payload.workout = workoutId;
  payload.date = new Date();

  const createdRating = await ratingModel.create(payload);
  const populatedRating = await createdRating.populate<{ athlete: User }>({
    path: "athlete",
  });
  return populatedRating;
}

export async function findRatingsByWorkoutId(workoutId: string) {
  return await ratingModel
    .find({ workout: workoutId })
    .sort({ date: -1 })
    .populate<{ athlete: User }>({ path: "athlete" })
    .exec();
}

export async function updateRating(ratingId: string, rating: Rating) {
  return await ratingModel
    .findByIdAndUpdate(
      ratingId,
      {
        value: rating.value,
        comment: rating.comment,
      },
      { new: true }
    )
    .populate<{ athlete: User }>({ path: "athlete" });
}

export async function deleteRating(ratingId: string) {
  return await ratingModel
    .findOneAndDelete({ _id: ratingId })
    .populate<{ athlete: User }>({ path: "athlete" });
}

export async function findRatingsByUserId(userId: string) {
  return await ratingModel
    .find({ athlete: userId })
    .sort({ date: -1 })
    .populate<{ workout: Workout }>({ path: "workout" })
    .exec();
}

export async function findMostRecentWorkoutsByUserId(
  userId: string,
  limit: number
) {
  return await ratingModel
    .find({ athlete: userId })
    .sort({ date: -1 })
    .limit(limit)
    .populate<{ workout: Workout }>({ path: "workout" });
}
