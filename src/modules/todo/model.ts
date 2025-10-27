import mongoose, { Schema, Document } from "mongoose";
import { ITodo } from "./type";

export interface ITodoDoc extends Document, ITodo {}

const todoSchema = new Schema<ITodoDoc>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Todo = mongoose.model<ITodo>("Todo", todoSchema);
