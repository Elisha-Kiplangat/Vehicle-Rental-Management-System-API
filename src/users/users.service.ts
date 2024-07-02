import { userInsert, userSelect } from "../drizzle/schema";
import db from "../drizzle/db";


export const getAllUserService = async (): Promise<userSelect[]> => {
    const users = await db.query.usersTable.findMany()
    return users;
}