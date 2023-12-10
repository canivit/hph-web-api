import { Express, Request, Response } from "express";
import { Workout } from "./model";
import * as dao from "./dao";

export function workoutRoutes(app: Express) {
  app.get("/api/workouts", findAllWorkouts);
  app.get("/api/workouts/:workoutId", findWorkoutById);
  app.get("/api/workouts/user/:userId", findWorkoutsByUserId);
  app.put("/api/workouts", createWorkout);
  app.post("/api/workouts/:workoutId", updateWorkout);
  app.delete("/api/workouts/:workoutId", deleteWorkout);
}

async function createWorkout(req: Request<{}, {}, Workout>, res: Response) {
  if (
    req.session.currentUser === undefined ||
    req.session.currentUser.role !== "Trainer"
  ) {
    res.status(401).send("Not signed in as trainer");
    return;
  }

  const workout = await dao.createWorkout(
    req.session.currentUser._id,
    req.body
  );
  res.json(workout);
}

async function findAllWorkouts(_req: Request, res: Response) {
  const workouts = await dao.findAllWorkouts();
  res.json(workouts);
}

async function findWorkoutById(
  req: Request<{ workoutId: string }>,
  res: Response
) {
  const workout = await dao.findWorkoutById(req.params.workoutId);
  res.json(workout);
}

async function updateWorkout(
  req: Request<{ workoutId: string }, {}, Workout>,
  res: Response
) {
  if (
    req.session.currentUser === undefined ||
    req.session.currentUser.role !== "Trainer"
  ) {
    res.status(401).send("Not signed in as trainer");
    return;
  }

  let workout = await dao.findWorkoutById(req.params.workoutId);
  if (workout === null) {
    res.status(404).send("Workout not found");
    return;
  }

  if (workout.trainer.username !== req.session.currentUser.username) {
    res.status(403).send("Not authorized to update workout");
    return;
  }

  await dao.updateWorkout(req.params.workoutId, req.body);
  workout = await dao.findWorkoutById(req.params.workoutId);
  res.json(workout);
}

async function deleteWorkout(
  req: Request<{ workoutId: string }>,
  res: Response
) {
  if (
    req.session.currentUser === undefined ||
    req.session.currentUser.role !== "Trainer"
  ) {
    res.status(401).send("Not signed in as trainer");
    return;
  }

  const workout = await dao.findWorkoutById(req.params.workoutId);
  if (workout === null) {
    res.status(404).send("Workout not found");
    return;
  }

  if (workout.trainer.username !== req.session.currentUser.username) {
    res.status(403).send("Not authorized to delete workout");
    return;
  }

  await dao.deleteWorkout(req.params.workoutId);
  res.sendStatus(200);
}

async function findWorkoutsByUserId(
  req: Request<{ userId: string }>,
  res: Response
) {
  const workouts = await dao.findWorkoutsByUserId(req.params.userId);
  res.json(workouts);
}
