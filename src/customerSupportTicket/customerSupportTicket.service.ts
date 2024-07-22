import { costomerSupportInsert, custommerSupportSelect, customerSupportTicketsTable } from "../drizzle/schema";
import db from "../drizzle/db";
import { count, eq } from 'drizzle-orm'


export const getAllSupportTicketService = async (limit?: number): Promise<custommerSupportSelect[]> => {
    try {
        if (limit) {
            const supportTickets = await db.query.customerSupportTicketsTable.findMany({
                limit: limit
            })
            return supportTickets;
        }
        return await db.query.customerSupportTicketsTable.findMany();
    }
    catch (err) {
        throw err;
    }
}

export const oneSupportTicketService = async (id: number): Promise<custommerSupportSelect | undefined> => {
    return await db.query.customerSupportTicketsTable.findFirst({
        where: eq(customerSupportTicketsTable.user_id, id)
    });
}

export const addSupportTicketService = async (supportTickets: custommerSupportSelect) => {
    await db.insert(customerSupportTicketsTable).values(supportTickets);
    return "supportTickets added successfully";
}

export const updateSupportTicketService = async (id: number, supportTickets: costomerSupportInsert) => {
    try {
        const supportTicketSearched = await oneSupportTicketService(id);
        if (!supportTicketSearched) {
            return false;
        }
        await db.update(customerSupportTicketsTable).set(supportTickets).where(eq(customerSupportTicketsTable.ticket_id, id));
        return "support Ticket updated successfully";

    }
    catch (err) {
        throw err;
    }
}

export const deleteSupportTicketService = async (id: number) => {
    await db.delete(customerSupportTicketsTable).where(eq(customerSupportTicketsTable.ticket_id, id));
    return "support Ticket deleted successfully"
}

export const getTotalUnreadMessages = async () => {
    const result =
        await db.select({ count: count() }).from(customerSupportTicketsTable).where(eq(customerSupportTicketsTable.status,'pending'));
    return result[0]?.count || 0;
};
