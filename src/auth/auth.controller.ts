import { Context } from 'hono';
import { addUserService } from './auth.service';
import { userInsert } from '../drizzle/schema';

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
