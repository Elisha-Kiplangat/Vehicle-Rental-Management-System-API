import db from '../drizzle/db';
import { usersTable, authenticationTable } from '../drizzle/schema';
import { userInsert, authInsert } from '../drizzle/schema';
import bcrypt from 'bcrypt'

export const addUserService = async (user: userInsert, password: string) => {
    try {
        const userInsertData: any = {
            ...user
        };

        userInsertData.created_at = user.created_at || new Date();
        userInsertData.updated_at = user.updated_at || new Date();

        const userResult = await db.insert(usersTable).values(userInsertData).returning({ user_id: usersTable.user_id });
        const userId = userResult[0].user_id;

        const hashedPassword = await bcrypt.hash(password, 10);

        const authData: authInsert = {
            user_id: userId,
            password: hashedPassword,
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
