import { Hono } from "hono";
import { getAllPaymentsController, onePaymentController, addPaymentController, updatePaymentController, deletePaymentController, createCheckoutSessionHandler, successHandler, cancelHandler, createBookingAndPaymentHandler } from "./payments.controller";
import { zValidator } from "@hono/zod-validator";
import { paymentSchema } from "../validators";
import { adminRoleAuth, userRoleAuth, allRoleAuth } from "../middleware/bearAuth";

export const paymentsRouter = new Hono();

paymentsRouter.get("/payments", adminRoleAuth, getAllPaymentsController);

paymentsRouter.get("/payments/:id", allRoleAuth, onePaymentController)

paymentsRouter.post("/payments", userRoleAuth, zValidator('json', paymentSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), addPaymentController)

paymentsRouter.put("/payments/:id", allRoleAuth, updatePaymentController)

paymentsRouter.delete("/payments/delete/:id", adminRoleAuth, deletePaymentController)

paymentsRouter.post('/booking/payment', createBookingAndPaymentHandler)

import { createPaymentIntentHandler, webhookHandler } from './payments.controller';

paymentsRouter.post('/create-payment-intent', createPaymentIntentHandler);
paymentsRouter.post('/create-checkout-session', createCheckoutSessionHandler);
paymentsRouter.post('/webhook', webhookHandler);
paymentsRouter.get('/success', successHandler);
paymentsRouter.get('/cancel', cancelHandler);
