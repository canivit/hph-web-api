import { User } from "../users/model";
import { removeId } from "../util";
import { Workout, workoutModel } from "./model";

export async function createWorkout(trainerId: string, workout: Workout) {
  const payload = removeId(workout);
  payload.post_date = new Date();
  payload.trainer = trainerId;
  return await workoutModel.create(payload);
}

export async function findWorkoutById(workoutId: string) {
  return await workoutModel
    .findById(workoutId)
    .populate<{ trainer: User }>({ path: "trainer" })
    .exec();
}

export async function updateWorkout(workoutId: string, workout: Workout) {
  return await workoutModel.updateOne(
    { _id: workoutId },
    { $set: removeId(workout) }
  );
}

export async function findAllWorkouts() {
  return await workoutModel
    .find()
    .sort({ post_date: -1 })
    .populate<{ trainer: User }>({ path: "trainer" })
    .exec();
}

export async function deleteWorkout(workoutId: string) {
  return await workoutModel.deleteOne({ _id: workoutId });
}

export async function findWorkoutsByUserId(userId: string) {
  return await workoutModel
    .find({ trainer: userId })
    .sort({ post_date: -1 })
    .populate<{ trainer: User }>({ path: "trainer" });
}

export async function findMostRecentWorkoutsByUserId(
  userId: string,
  limit: number
) {
  return await workoutModel
    .find({ trainer: userId })
    .sort({ post_date: -1 })
    .limit(limit)
    .populate<{ trainer: User }>({ path: "trainer" });
}
