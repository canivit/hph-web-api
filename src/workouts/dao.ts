import { removeId } from "../util";
import { Workout, workoutModel } from "./model";

export async function createWorkout(workout: Workout) {
  const payload = removeId(workout);
  payload.post_date = new Date();
  return await workoutModel.create(payload);
}

export async function findWorkoutById(workoutId: string) {
  return await workoutModel.findById(workoutId);
}

export async function updateWorkout(workoutId: string, workout: Workout) {
  return await workoutModel.updateOne(
    { _id: workoutId },
    { $set: removeId(workout) }
  );
}
