import { Express, Request, Response } from "express";
import * as dao from "./dao";
import { User } from "./model";

declare module "express-session" {
  interface SessionData {
    currentUser: User;
  }
}

export function userRoutes(app: Express) {
  app.get("/api/users/signed_in", getSignedInUser);
  app.get("/api/users/signout", signout);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signup", signup);
}

async function signin(req: Request<{}, {}, Credentials>, res: Response) {
  const { username, password } = req.body;
  const user = await dao.findUserByCredentials(username, password);
  if (!user) {
    res.status(401).send("Invalid credentials");
    return;
  }

  req.session.currentUser = user;
  res.send(user);
}

async function signup(req: Request<{}, {}, User>, res: Response) {
  let user = await dao.findUserByUsername(req.body.username);
  if (user !== null) {
    res.status(400).send("Username already taken");
    return;
  }

  user = await dao.createUser(req.body);
  req.session.currentUser = user;
  res.json(user);
}

async function getSignedInUser(req: Request, res: Response) {
  if (!req.session.currentUser) {
    res.status(401).send("Not signed in");
    return;
  }

  res.send(req.session.currentUser);
}

async function signout(req: Request, res: Response) {
  req.session.destroy(() => {});
  res.sendStatus(200);
}

type Credentials = {
  username: string;
  password: string;
};
