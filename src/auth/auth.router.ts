import { Hono } from 'hono';
import { addUserController } from './auth.controller';
import { zValidator } from '@hono/zod-validator';
import { registerSchema } from '../validators';

export const authRouter = new Hono();

// authRouter.post('/register', zValidator('json', registerSchema, (result, c): any => {
//     if (!result.success) {
//         return c.json(result.error, 400);
//     }
//     return null;
// }), addUserController);

authRouter.post('/register', zValidator('json', registerSchema), addUserController);


export default authRouter;
