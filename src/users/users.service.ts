import { userInsert, userSelect, usersTable } from "../drizzle/schema";
import db from "../drizzle/db";
import { eq } from 'drizzle-orm'


export const getAllUserService = async (limit?: number): Promise<userSelect[]> => {
    try {
        if (limit) {
            const users = await db.query.usersTable.findMany({
                limit: limit
            })
            return users;
        }
        return await db.query.usersTable.findMany();
    }
    catch (err) {
        throw err;
    }
}

export const oneUserService = async (id: number): Promise<userSelect | undefined> => {
    return await db.query.usersTable.findFirst({
        where: eq(usersTable.user_id, id)
    });
}

export const addUserService = async (users: userSelect) => {
    await db.insert(usersTable).values(users);
    return "users added successfully";
}

export const updateUserService = async (id: number, users: userInsert) => {
    try {
        const usersSearched = await oneUserService(id);
        if (!usersSearched) {
            return false;
        }
        await db.update(usersTable).set(users).where(eq(usersTable.user_id, id));
        return "users updated successfully";

    }
    catch (err) {
        throw err;
    }
}

export const deleteUserService = async (id: number) => {
    await db.delete(usersTable).where(eq(usersTable.user_id, id));
    return "users deleted successfully"
}