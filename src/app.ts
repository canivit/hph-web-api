import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRoutes } from "./users/routes";
import session, { SessionOptions } from "express-session";
import "dotenv/config";

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

app.listen(process.env.PORT || 4000);
