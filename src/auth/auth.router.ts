import { Hono } from 'hono';
import { addUserController, loginController } from './auth.controller';
import { zValidator } from '@hono/zod-validator';
import { loginSchema, registerSchema } from '../validators';

export const authRouter = new Hono();

authRouter.post('/register', zValidator('json', registerSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), addUserController);

authRouter.post('/login', zValidator('json', loginSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), loginController);

export default authRouter;
