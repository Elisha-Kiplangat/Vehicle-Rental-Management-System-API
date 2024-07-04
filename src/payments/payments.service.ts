import { paymentInsert, paymentSelect, paymentsTable } from "../drizzle/schema";
import db from "../drizzle/db";
import { eq } from 'drizzle-orm'


export const getAllPaymentService = async (limit?: number): Promise<paymentSelect[]> => {
    try {
        if (limit) {
            const payments = await db.query.paymentsTable.findMany({
                limit: limit
            })
            return payments;
        }
        return await db.query.paymentsTable.findMany();
    }
    catch (err) {
        throw err;
    }
}

export const onePaymentService = async (id: number): Promise<paymentSelect | undefined> => {
    return await db.query.paymentsTable.findFirst({
        where: eq(paymentsTable.payment_id, id)
    });
}

export const addPaymentService = async (payments: paymentSelect) => {
    await db.insert(paymentsTable).values(payments);
    return "payment added successfully";
}

export const updatePaymentService = async (id: number, payments: paymentInsert) => {
    try {
        const paymentSearched = await onePaymentService(id);
        if (!paymentSearched) {
            return false;
        }
        await db.update(paymentsTable).set(payments).where(eq(paymentsTable.payment_id, id));
        return "payment updated successfully";

    }
    catch (err) {
        throw err;
    }
}

export const deletePaymentService = async (id: number) => {
    await db.delete(paymentsTable).where(eq(paymentsTable.payment_id, id));
    return "payment deleted successfully"
}