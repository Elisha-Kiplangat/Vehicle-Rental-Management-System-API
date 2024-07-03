import { Context } from 'hono';
import 'dotenv/config';
import { addUserService, loginService, getAuthDetails } from './auth.service';
import { userInsert } from '../drizzle/schema';
import bcrypt from 'bcrypt'
import { sign } from 'hono/jwt'


export const addUserController = async (c: Context): Promise<Response> => {
    try {
        const { full_name, email, contact_phone, address, role, created_at, updated_at, password } = await c.req.json();

        const user: userInsert = {
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

        // Check if user exists in users table
        const userExist = await loginService(email);
        if (!userExist) return c.json({ error: 'User not found' }, 404); // Not found

        // Get authentication details from authentication table
        const authDetails = await getAuthDetails(userExist.user_id);
        if (!authDetails) return c.json({ error: 'Authentication details not found' }, 404); // Not found

        // Verify password
        const userMatch = await bcrypt.compare(password, authDetails.password as string);
        if (!userMatch) {
            return c.json({ error: 'Invalid credentials' }, 401); // Unauthorized
        }

        // Create a payload
        const payload = {
            sub: userExist.email,
            role: userExist.role,
            exp: Math.floor(Date.now() / 1000) + 60 * 180 // 3 hours => SESSION EXPIRATION
        };
        const secret = process.env.JWT_SECRET as string; // Secret key
        const token = await sign(payload, secret); // Create a JWT token

        let user = userExist?.email;
        let role = userExist?.role;
        return c.json({ token, user: { role, user } }, 200); 
        // return c.json({ token, user: { role: userExist.role, email: userExist.email } }, 200); // Return token and user details
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
};