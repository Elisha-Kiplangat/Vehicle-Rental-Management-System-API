import { Hono } from "hono";
import { getAllUsersController, oneUserController, addUserController, updateUserController, deleteUserController } from "./users.controller";
import { zValidator } from "@hono/zod-validator";
import { userSchema } from "../validators";

export const usersRouter = new Hono();

usersRouter.get("/users", getAllUsersController);

usersRouter.get("/users/:id", oneUserController)

usersRouter.post("/users", zValidator('json', userSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), addUserController)

usersRouter.put("/users/:id", updateUserController)

usersRouter.delete("/delete/:id", deleteUserController)