import { Context } from "hono";
import { getAllUserService } from "./users.service";

export const getAllUsersController = async (c: Context) => {
    const users = await getAllUserService();
    return c.json(users);
}