import { Context } from 'hono';
import 'dotenv/config';
import { addUserService, loginService, getAuthDetails } from './auth.service';
import { userInsert } from '../drizzle/schema';
import bcrypt from 'bcrypt'
import { sign } from 'hono/jwt'

interface AddUserRequest {
    full_name: string;
    email: string;
    contact_phone: string;
    address: string;
    role?: string;
    created_at?: Date;
    updated_at?: Date;
    password: string;
}

export const addUserController = async (c: Context): Promise<Response> => {
    try {
        const { full_name, email, contact_phone, address, role, created_at, updated_at, password }: AddUserRequest = await c.req.json();

        const user = {
            full_name,
            email,
            contact_phone,
            address,
            role: role || 'user',
            created_at,
            updated_at
        };

        const message = await addUserService(user, password);
        return c.json({ message }, 201);
    } catch (error: any) {
        return c.json({ message: 'Error adding user', error: error.message }, 500);
    }
};


export const loginController = async (c: Context): Promise<Response> => {
    try {
        const { email, password } = await c.req.json();

        const userExist = await loginService(email);
        if (!userExist) return c.json({ error: 'User not found' }, 404); 

        const authDetails = await getAuthDetails(userExist.user_id);
        if (!authDetails) return c.json({ error: 'Authentication details not found' }, 404);

        
        const userMatch = await bcrypt.compare(password, authDetails.password as string);
        if (!userMatch) {
            return c.json({ error: 'Invalid credentials' }, 401); 
        }

        const payload = {
            sub: userExist.email,
            role: userExist.role,
            user_id: userExist.user_id,
            exp: Math.floor(Date.now() / 1000) + 60 * 180 
        };
        const secret = process.env.JWT_SECRET as string; 
        const token = await sign(payload, secret); 

        let user = userExist?.email;
        let role = userExist?.role;
        let user_id = userExist?.user_id;
        return c.json({ user_id, token,  role, user  }, 200); 
        
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
};