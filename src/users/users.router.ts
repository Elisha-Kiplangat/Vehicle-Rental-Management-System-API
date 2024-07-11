import { Hono } from "hono";
import { getAllUsersController, oneUserController, addUserController, updateUserController, deleteUserController, userWithBookingController, userSupportController } from "./users.controller";
// import { zValidator } from "@hono/zod-validator";
// import { userSchema } from "../validators";
import { adminRoleAuth, allRoleAuth } from "../middleware/bearAuth";

export const usersRouter = new Hono();

usersRouter.get("/users", adminRoleAuth, getAllUsersController);

usersRouter.get("/users/:id", allRoleAuth, oneUserController)

usersRouter.get("/user-booking/:id", adminRoleAuth, userWithBookingController)



usersRouter.get("/users-support/:id", allRoleAuth, userSupportController)

// usersRouter.post("/users", adminRoleAuth, zValidator('json', userSchema, (result, c) => {
//     if (!result.success) {
//         return c.json(result.error, 400)
//     }
// }), addUserController)

usersRouter.put("/users/:id", allRoleAuth, updateUserController)

usersRouter.delete("/delete/:id", allRoleAuth, deleteUserController)