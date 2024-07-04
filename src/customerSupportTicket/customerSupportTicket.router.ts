import { Hono } from "hono";
import { getAllSupportTicketsController, oneSupportTicketController, addSupportTicketController, updateSupportTicketController, deleteSupportTicketController } from "./customerSupportTicket.controller";
import { zValidator } from "@hono/zod-validator";
import { supportTicketSchema } from "../validators";
import { adminRoleAuth, userRoleAuth, allRoleAuth } from "../middleware/bearAuth";

export const supportTicketsRouter = new Hono();

supportTicketsRouter.get("/supportTickets", adminRoleAuth, getAllSupportTicketsController);

supportTicketsRouter.get("/supportTickets/:id", allRoleAuth, oneSupportTicketController)

supportTicketsRouter.post("/supportTickets", userRoleAuth, zValidator('json', supportTicketSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), addSupportTicketController)

supportTicketsRouter.put("/supportTickets/:id", allRoleAuth, updateSupportTicketController)

supportTicketsRouter.delete("/supportTickets/delete/:id",allRoleAuth, deleteSupportTicketController)