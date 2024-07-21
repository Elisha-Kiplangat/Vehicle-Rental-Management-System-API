import { Context } from "hono";
import { getAllSupportTicketService, oneSupportTicketService, addSupportTicketService, updateSupportTicketService, deleteSupportTicketService, getTotalUnreadMessages } from "./customerSupportTicket.service";

export const getAllSupportTicketsController = async (c: Context) => {
    try {
        const limit = Number(c.req.query('limit'));
        const supportTickets = await getAllSupportTicketService(limit);
        if (supportTickets == null || supportTickets.length == 0) {
            return c.text("No supportTickets found", 404);
        }
        return c.json(supportTickets);
    }
    catch (err: any) {
        console.error(err)
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const oneSupportTicketController = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")
    const supportTicket = await oneSupportTicketService(id);
    if (supportTicket == null) {
        return c.text("supportTicket not found", 404);
    }
    return c.json(supportTicket, 200);

}

export const addSupportTicketController = async (c: Context) => {
    try {
        const supportTicket = await c.req.json();
        const newsupportTicket = await addSupportTicketService(supportTicket);

        return c.json(newsupportTicket, 201)

    }
    catch (err) {
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const updateSupportTicketController = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")
    const supportTicket = await c.req.json();

    try {
        const searchedsupportTicket = await oneSupportTicketService(id);
        if (searchedsupportTicket == undefined) return c.text("supportTicket not found", 404);

        const res = await updateSupportTicketService(id, supportTicket);

        if (!res) return c.text("supportTicket not updated", 404);

        return c.json({ msg: res }, 201);
    }
    catch (err: any) {
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const deleteSupportTicketController = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")

    try {
        const supportTicket = await oneSupportTicketService(id);
        if (supportTicket == undefined) return c.text("support Ticket not found", 404);

        const res = await deleteSupportTicketService(id);
        if (!res) return c.text("support Ticket not deleted", 404);

        return c.json({ msg: res }, 201);

    }
    catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}


export const getTotalUnreadMessagesController = async (c: Context) => {
    try {
        const totalMessages = await getTotalUnreadMessages();
        return c.json({ totalMessages });
    } catch (error) {
        console.error('Failed to get total unread messages:', error);
        return c.json({ error: 'Failed to get total unread messages' }, 500);
    }
};
