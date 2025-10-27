import { Router } from "express";
import { UserRoutes } from "../modules/user/routes";
import { TodoRoutes } from "../modules/todo/routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/todos",
    route: TodoRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
