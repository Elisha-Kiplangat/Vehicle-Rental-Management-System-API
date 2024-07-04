import { Hono } from "hono";
import { getAllSupportTicketsController, oneSupportTicketController, addSupportTicketController, updateSupportTicketController, deleteSupportTicketController } from "./customerSupportTicket.controller";
import { zValidator } from "@hono/zod-validator";
import { supportTicketSchema } from "../validators";

export const supportTicketsRouter = new Hono();

supportTicketsRouter.get("/supportTickets", getAllSupportTicketsController);

supportTicketsRouter.get("/supportTickets/:id", oneSupportTicketController)

supportTicketsRouter.post("/supportTickets", zValidator('json', supportTicketSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), addSupportTicketController)

supportTicketsRouter.put("/supportTickets/:id", updateSupportTicketController)

supportTicketsRouter.delete("/supportTickets/delete/:id", deleteSupportTicketController)