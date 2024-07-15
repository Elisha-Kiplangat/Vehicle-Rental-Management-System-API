import db from '../drizzle/db';
import { usersTable, authenticationTable } from '../drizzle/schema';
import { userInsert, authInsert, authSelect } from '../drizzle/schema';
import bcrypt from 'bcrypt'
import { sql } from 'drizzle-orm'
import mailFunction from '../mail/register'

interface typeUserInsert {
    full_name: string;
    email: string;
    contact_phone: string;
    address: string;
    role: string;
    created_at?: Date;
    updated_at?: Date;
}

interface TuserLogin {
    user_id: number;
    email: string;
    role: string;
}

export const addUserService = async (user: typeUserInsert, password: string) => {
    try {
        const userInsertData: any = {
            full_name: user.full_name,
            email: user.email,
            contact_phone: user.contact_phone,
            address: user.address,
            role: user.role || 'user',
            created_at: user.created_at || new Date(),
            updated_at: user.updated_at || new Date(),
        };

        const userResult = await db.insert(usersTable).values(userInsertData).returning({ user_id: usersTable.user_id });
        const userId = userResult[0].user_id;

        const hashedPassword = await bcrypt.hash(password, 10);

        const authData: any = {
            user_id: userId,
            password: hashedPassword,
            created_at: user.created_at || new Date(),
            updated_at: user.updated_at || new Date(),
        };


        await db.insert(authenticationTable).values(authData);
        await mailFunction(user.email, 'Registration Successful', user)
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