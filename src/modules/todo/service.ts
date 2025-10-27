import AppError from "../../errors/AppError";
import { ITodoDoc, Todo } from "./model";
import { ITodo } from "./type";

const create = async (todoData: ITodo): Promise<ITodoDoc> => {
  const data = await Todo.create(todoData);
  if (!data) {
    throw new AppError("Failed to create todo", 500);
  }
  return data;
};

const getAll = async (): Promise<ITodoDoc[]> => {
  const data = await Todo.find();
  if (!data) {
    throw new AppError("No todos found", 404);
  }
  return data;
};

const getById = async (id: string) => {
  const todo = await Todo.findById(id);
  if (!todo) {
    throw new AppError("Todo not found", 404);
  }
  return todo;
};

export const TodoService = {
  create,
  getAll,
  getById,
};
