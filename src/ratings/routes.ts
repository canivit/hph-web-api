import { Express, Request, Response } from "express";
import { Rating } from "./model";
import * as dao from "./dao";

export function ratingRoutes(app: Express) {
  app.put("/api/ratings/:workoutId", createRating);
}

async function createRating(
  req: Request<{ workoutId: string }, {}, Rating>,
  res: Response
) {
  if (
    req.session.currentUser === undefined ||
    req.session.currentUser.role !== "Athlete"
  ) {
    res.status(401).send("Not signed in as athlete");
    return;
  }

  const result = await dao.createRating(
    req.params.workoutId,
    req.session.currentUser._id,
    req.body
  );

  if (result === "WorkoutNotFound") {
    res.status(404).send("Workout not found");
    return;
  }

  if (result === "AlreadyRated") {
    res.status(400).send("Already rated");
    return;
  }

  res.json(result);
}
