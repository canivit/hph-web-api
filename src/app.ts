import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRoutes } from "./users/routes";
import session, { SessionOptions } from "express-session";
import "dotenv/config";
import { User } from "./users/model";
import { workoutRoutes } from "./workouts/routes";
import { ratingRoutes } from "./ratings/routes";

declare module "express-session" {
  interface SessionData {
    currentUser: User;
  }
}

mongoose.connect(process.env.DB_CONNECTION_STRING!);

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

const sessionOptions: SessionOptions = {
  secret: "any string",
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}
app.use(session(sessionOptions));

app.use(express.json());

userRoutes(app);
workoutRoutes(app);
ratingRoutes(app);

app.listen(process.env.PORT || 4000);
