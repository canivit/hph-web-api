import { User, userModel } from "./model";

export const createUser = async (user: User) => await userModel.create(user);
export const findAllUsers = async () => await userModel.find();
export const findUserById = async (id: string) => await userModel.findById(id);
export const findUserByUsername = async (username: string) =>
  await userModel.findOne({ username: username });
export const findUserByCredentials = async (
  username: string,
  password: string
): Promise<User | null> => await userModel.findOne({ username, password });
export const updateUser = async (id: string, user: User) =>
  await userModel.updateOne({ _id: id }, { $set: user });
export const deleteUser = async (id: string) =>
  userModel.deleteOne({ _id: id });
