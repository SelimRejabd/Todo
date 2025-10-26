import express from "express";
import { UserController } from "./controller";

const router = express.Router();

router.route("/").post(UserController.create).get(UserController.getAll);
router.route("/:id").get(UserController.getById);

export const UserRoutes = router;
