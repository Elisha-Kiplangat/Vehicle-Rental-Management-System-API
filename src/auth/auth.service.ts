import db from '../drizzle/db';
import { usersTable, authenticationTable } from '../drizzle/schema';
import { userInsert, authInsert, authSelect } from '../drizzle/schema';
import bcrypt from 'bcrypt'
import { sql } from 'drizzle-orm'

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


export const loginService = async (email: string) => {
    return await db.query.usersTable.findFirst({
        columns: {
            user_id: true,
            email: true,
            role: true
        },
        where: sql`${usersTable.email} = ${email}`
    });
};

export const getAuthDetails = async (user_id: number) => {
    return await db.query.authenticationTable.findFirst({
        columns: {
            password: true
        },
        where: sql`${authenticationTable.user_id} = ${user_id}`
    });
};