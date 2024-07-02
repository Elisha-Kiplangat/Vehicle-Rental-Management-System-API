import { Hono } from "hono";
import { getAllUsersController } from "./users.controller";

export const usersRouter = new Hono();

usersRouter.get("/users", getAllUsersController);