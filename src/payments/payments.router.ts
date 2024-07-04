import { Hono } from "hono";
import { getAllPaymentsController, onePaymentController, addPaymentController, updatePaymentController, deletePaymentController } from "./payments.controller";
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