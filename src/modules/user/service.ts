import AppError from "../../errors/AppError";
import { User } from "./model";


const create = async (userData: IUser) => {
  const data = await User.create(userData);
  if (!data) {
    throw new AppError("Failed to create user", 500);
  }
  return data;
};

const getAll = async () => {
  const data = await User.find();
  if (!data) {
    throw new AppError("No users found", 404);
  }
  return data;
};

const getById = async (id: string) => {
  const data = await User.findById(id);
  if (!data) {
    throw new AppError("User not found", 404);
  }
  return data;
};

export const UserService = {
  create,
  getAll,
  getById,
};
