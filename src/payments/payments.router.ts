import { Hono } from "hono";
import { getAllPaymentsController, onePaymentController, addPaymentController, updatePaymentController, deletePaymentController } from "./payments.controller";
import { zValidator } from "@hono/zod-validator";
import { paymentSchema } from "../validators";

export const paymentsRouter = new Hono();

paymentsRouter.get("/payments", getAllPaymentsController);

paymentsRouter.get("/payments/:id", onePaymentController)

paymentsRouter.post("/payments", zValidator('json', paymentSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), addPaymentController)

paymentsRouter.put("/payments/:id", updatePaymentController)

paymentsRouter.delete("/payments/delete/:id", deletePaymentController)