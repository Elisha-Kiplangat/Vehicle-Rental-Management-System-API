import { Context } from "hono";
import { getAllUserService, oneUserService, addUserService, updateUserService, deleteUserService, userWithBookingService, userSupportService } from "./users.service";
import { verifyToken } from "../middleware/bearAuth";
import 'dotenv/config';

export const getAllUsersController = async (c: Context) => {
    try {
        const limit = Number(c.req.query('limit'));
        const users = await getAllUserService(limit);
        if (users == null || users.length == 0) {
            return c.text("No users found", 404);
        }
        return c.json(users);
    }
    catch (err: any) {
        console.error(err)
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const oneUserController = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")
    const token = c.req.header('Authorization');

    const decoded = await verifyToken(token!, process.env.JWT_SECRET as string)

    if (decoded?.user_id !== id && decoded?.role != 'admin') return c.text("not authorized", 404);
    
    const user = await oneUserService(id);
    if (user == null) {
        return c.text("User not found", 404);
    }   
    return c.json(user, 200);

}

export const addUserController = async (c: Context) => {
    try{
        const user = await c.req.json();
        const newUser = await addUserService(user);

        return c.json(newUser, 201)

    }
    catch(err){
        return c.json({error: 'Internal Server Error'}, 500)
    }
}

export const updateUserController = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")
    const token = c.req.header('Authorization');

    const decoded = await verifyToken(token!, process.env.JWT_SECRET as string)

    if (decoded?.user_id !== id && decoded?.role != 'admin') return c.text("not authorized", 404);
    const user = await c.req.json();

    try {
        const searchedUser = await oneUserService(id);
        if (searchedUser == undefined) return c.text("User not found", 404);
        
        const res = await updateUserService(id, user);
        
        if (!res) return c.text("User not updated", 404);

        return c.json({ msg: res }, 201);
    }
    catch (err: any) {
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const deleteUserController = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")
    const token = c.req.header('Authorization');

    const decoded = await verifyToken(token!, process.env.JWT_SECRET as string)

    if (decoded?.user_id !== id && decoded?.role != 'admin') return c.text("not authorized", 404);
    
    try{
         const user = await oneUserService(id);
        if (user == undefined) return c.text("User not found", 404);
       
        const res = await deleteUserService(id);
        if (!res) return c.text("User not deleted", 404);

        return c.json({ msg: res }, 201);

    }
    catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const userWithBookingController = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")
    const token = c.req.header('Authorization');

    const decoded = await verifyToken(token!, process.env.JWT_SECRET as string)

    if (decoded?.user_id !== id && decoded?.role != 'admin') return c.text("not authorized", 404);

    const user = await userWithBookingService(id);
    if (user == null) {
        return c.text("User info not found", 404);
    }
    return c.json(user, 200);
}

export const userSupportController = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")
    const token = c.req.header('Authorization');

    const decoded = await verifyToken(token!, process.env.JWT_SECRET as string)

    if (decoded?.user_id !== id && decoded?.role != 'admin') return c.text("not authorized", 404);
    
    const user = await userSupportService(id);
    if (user == null) {
        return c.text("User info not found", 404);
    }
    return c.json(user, 200);
}