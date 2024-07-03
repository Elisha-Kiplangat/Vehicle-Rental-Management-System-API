import db from '../drizzle/db';
import { usersTable, authenticationTable } from '../drizzle/schema';
import { userInsert, authInsert } from '../drizzle/schema';
import bcrypt from 'bcrypt';

export const addUserService = async (user: userInsert, password: string) => {
    try {
        const userInsertData: any = {
            ...user
        };

        if (user.created_at) {
            userInsertData.created_at = user.created_at;
        } else {
            userInsertData.created_at = new Date();
        }

        if (user.updated_at) {
            userInsertData.updated_at = user.updated_at;
        } else {
            userInsertData.updated_at = new Date();
        }

        const userResult = await db.insert(usersTable).values(userInsertData).returning({ user_id: usersTable.user_id });
        const userId = userResult[0].user_id;

        const authData: authInsert = {
            user_id: userId,
            password: password,
            updated_at: ''
        };

        if (user.created_at) {
            authData.created_at = user.created_at;
        }

        if (user.updated_at) {
            authData.updated_at = user.updated_at;
        } 

        await db.insert(authenticationTable).values(authData);

        return 'User added successfully';
    } catch (error: any) {
        throw new Error(`Error adding user: ${error.message}`);
    }
};
