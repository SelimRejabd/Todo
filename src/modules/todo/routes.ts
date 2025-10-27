import express from "express";
import { TodoController } from "./controller";
import validateRequest from "../../middleware/validateRequest";
import { TodoValidation } from "./validation";

const router = express.Router();

router
  .route("/")
  .post(validateRequest(TodoValidation.create), TodoController.create)
  .get(TodoController.getAll);
router.route("/:id").get(TodoController.getById);

export const TodoRoutes = router;
