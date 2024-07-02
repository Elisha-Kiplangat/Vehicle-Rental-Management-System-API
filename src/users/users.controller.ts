import { Context } from "hono";
import { getAllUserService, oneUserService, addUserService, updateUserService, deleteUserService } from "./users.service";

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