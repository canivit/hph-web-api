import { Express, Request, Response } from "express";
import { Rating } from "./model";
import * as dao from "./dao";

export function ratingRoutes(app: Express) {
  app.put("/api/ratings/workout/:workoutId", createRating);
  app.get("/api/ratings/workout/:workoutId", findRatingsByWorkoutId);
  app.get(
    "/api/ratings/user/:userId/recent/:limit",
    findMostRecentWorkoutsByUserId
  );
  app.get("/api/ratings/user/:userId", findRatingsByUserId);
  app.post("/api/ratings/:ratingId", updateRating);
  app.delete("/api/ratings/:ratingId", deleteRating);
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

async function findRatingsByWorkoutId(
  req: Request<{ workoutId: string }>,
  res: Response
) {
  const ratings = await dao.findRatingsByWorkoutId(req.params.workoutId);
  res.json(ratings);
}

async function updateRating(
  req: Request<{ ratingId: string }, {}, Rating>,
  res: Response
) {
  if (
    req.session.currentUser === undefined ||
    req.session.currentUser.role !== "Athlete"
  ) {
    res.status(401).send("Not signed in as athlete");
    return;
  }

  const rating = await dao.updateRating(req.params.ratingId, req.body);
  if (rating === null) {
    res.status(404).send("Rating not found");
    return;
  }

  if (req.session.currentUser.username !== rating.athlete.username) {
    res.status(401).send("Not authorized to update rating");
    return;
  }

  res.json(rating);
}

async function deleteRating(req: Request<{ ratingId: string }>, res: Response) {
  if (
    req.session.currentUser === undefined ||
    req.session.currentUser.role !== "Athlete"
  ) {
    res.status(401).send("Not signed in as athlete");
    return;
  }

  const rating = await dao.deleteRating(req.params.ratingId);
  if (rating === null) {
    res.status(404).send("Rating not found");
    return;
  }

  if (req.session.currentUser.username !== rating.athlete.username) {
    res.status(401).send("Not authorized to delete rating");
    return;
  }

  res.json(rating);
}

async function findRatingsByUserId(
  req: Request<{ userId: string }>,
  res: Response
) {
  const ratings = await dao.findRatingsByUserId(req.params.userId);
  res.json(ratings);
}

async function findMostRecentWorkoutsByUserId(
  req: Request<{ userId: string; limit: string }>,
  res: Response
) {
  const limit = parseInt(req.params.limit);
  const ratings = await dao.findMostRecentWorkoutsByUserId(
    req.params.userId,
    limit
  );
  res.json(ratings);
}
