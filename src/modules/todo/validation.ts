import { z } from "zod";

const create = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
  }),
});

const update = z.object({
  body: z
    .object({
      title: z.string().min(1, "Title is required").optional(),
      description: z.string().min(1, "Description is required").optional(),
      completed: z.boolean().optional(),
    })
    .optional(),
});

export const TodoValidation = {
  create,
  update,
};
