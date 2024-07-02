import { userInsert, userSelect, usersTable } from "../drizzle/schema";
import db from "../drizzle/db";
import {eq} from 'drizzle-orm'


export const getAllUserService = async (limit?: number): Promise<userSelect[]> => {
    try{
        if (limit){
            const users = await db.query.usersTable.findMany({
                limit: limit
            })
            return users;
        }
        return await db.query.usersTable.findMany();
    }
    catch(err){
        throw err;
    }
}

export const oneUserService = async (id: number): Promise<userSelect | undefined> => {
    return await db.query.usersTable.findFirst({
        where: eq(usersTable.user_id, id)
    });
}

export const addUserService = async (user: userSelect) => {
    await db.insert (usersTable).values(user);
    return "User added successfully";
}

export const updateUserService = async (id: number, user: userInsert) => {
    try{
        const userSearched = await oneUserService(id);
        if (!userSearched) {
            return false;
        }
        await db.update(usersTable).set(user).where(eq(usersTable.user_id, id));
        return "User updated successfully";

    }
    catch(err){
        throw err;
    }
}

export const deleteUserService = async (id: number) => {
    await db.delete(usersTable).where(eq(usersTable.user_id, id));
    return "User deleted successfully"
}