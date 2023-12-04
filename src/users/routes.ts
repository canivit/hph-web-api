import { Express, Request, Response } from "express";
import * as dao from "./dao";
import { User } from "./model";

export function userRoutes(app: Express) {
  app.get("/api/users/signed_in", getSignedInUser);
  app.get("/api/users/signout", signout);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signup", signup);
  app.post("/api/users/:userId", updateUser);
}

async function signin(req: Request<{}, {}, Credentials>, res: Response) {
  const { username, password } = req.body;
  const user = await dao.findUserByCredentials(username, password);
  if (!user) {
    res.status(401).send("Invalid credentials");
    return;
  }

  req.session.currentUser = user;
  res.json(user);
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

  res.json(req.session.currentUser);
}

async function signout(req: Request, res: Response) {
  req.session.destroy(() => {});
  res.sendStatus(200);
}

async function updateUser(
  req: Request<{ userId: string }, {}, User>,
  res: Response
) {
  const { userId } = req.params;
  if (
    req.session.currentUser === undefined ||
    req.session.currentUser._id !== userId
  ) {
    res.status(401).send("Not signed in");
    return;
  }

  const user = await dao.findUserById(userId);
  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  await dao.updateUser(userId, req.body);
  req.session.currentUser = (await dao.findUserById(userId))!;
  res.json(req.session.currentUser);
}

type Credentials = {
  username: string;
  password: string;
};
