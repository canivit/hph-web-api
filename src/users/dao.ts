import { removeId } from "../util";
import { User, userModel } from "./model";

export const createUser = async (user: User) =>
  await userModel.create(removeId(user));

export const findAllUsers = async () => await userModel.find();

export const findUserById = async (id: string) => await userModel.findById(id);

export const findUserByUsername = async (username: string) =>
  await userModel.findOne({ username: username });

export const findUserByCredentials = async (
  username: string,
  password: string
): Promise<User | null> => await userModel.findOne({ username, password });

export const updateUser = async (id: string, user: User) =>
  await userModel.updateOne({ _id: id }, { $set: removeId(user) });

export const deleteUser = async (id: string) =>
  userModel.deleteOne({ _id: id });

export async function findMostRecentlyCreatedUsers(limit: number) {
  const trainers = await userModel
    .find({ role: "Trainer" })
    .sort({ _id: -1 })
    .limit(limit);

  const athletes = await userModel
    .find({ role: "Athlete" })
    .sort({ _id: -1 })
    .limit(limit);

  return {
    trainers,
    athletes,
  };
}
