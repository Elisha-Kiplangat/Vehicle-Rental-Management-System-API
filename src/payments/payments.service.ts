import { bookingsTable, paymentInsert, paymentSelect, paymentsTable } from "../drizzle/schema";
import db from "../drizzle/db";
import { eq } from 'drizzle-orm'
import 'dotenv/config'
import Stripe from 'stripe';

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

//booking with payment
export const createBookingAndPayment = async (data: any) => {
    try {
        const bookingInsertData: any = {
            user_id: data.user_id,
            vehicle_id: data.vehicle_id,
            location_id: data.location_id,
            booking_date: data.booking_date,
            return_date: data.return_date,
            total_amount: data.total_amount,
            booking_status: data.booking_status || 'pending',
            created_at: new Date(),
            updated_at: new Date(),
        };

        const bookingResult = await db.insert(bookingsTable).values(bookingInsertData).returning({ booking_id: bookingsTable.booking_id });
        const bookingId = bookingResult[0].booking_id;

        const paymentInsertData: any = {
            booking_id: bookingId,
            amount: data.total_amount,
            payment_status: data.booking_status || 'pending',
            payment_date: data.payment_date,
            payment_method: data.payment_method || 'card',
            transaction_id: data.transaction_id,
            created_at: new Date(),
            updated_at: new Date(),
        };

        await db.insert(paymentsTable).values(paymentInsertData);

        return 'Booking and payment added successfully';
    } catch (error: any) {
        throw new Error(`Error creating booking and payment: ${error.message}`);
    }
};



const stripe = new Stripe(process.env.STRIPE as string, {
    apiVersion: '2024-06-20',
});

export const createPaymentIntent = async (amount: number, currency: string, booking_id: number) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
    });

    await db.insert(paymentsTable).values({
        booking_id,
        amount,
        payment_status: 'Pending',
        payment_method: 'card',
        transaction_id: paymentIntent.id,
    }).execute();

    return paymentIntent;
};

export const createCheckoutSession = async (amount: number, currency: string, booking_id: number) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: 'Car rental',
                    },
                    unit_amount: Math.round(amount),
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: process.env.SUCCESS_URL as string,
        cancel_url: process.env.CANCEL_URL as string,
    });

    await db.insert(paymentsTable).values({
        booking_id,
        amount,
        payment_status: 'Pending',
        payment_method: 'card',
        transaction_id: session.id,
    }).execute();

    return session;
};

export const handleWebhook = async (payload: string, sig: string, webhookSecret: string) => {
    try {
        const event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;

            await db.update(paymentsTable).set({
                payment_status: 'Succeeded',
                payment_date: new Date(session.created * 1000).toISOString(),
            }).where(eq(paymentsTable.transaction_id, session.id)).execute();

            const payment = await db.query.paymentsTable.findFirst({
                where: eq(paymentsTable.transaction_id, session.id)});
            if (payment) {
                await db.update(bookingsTable).set({
                    booking_status: 'Succeeded',
                }).where(eq(bookingsTable.booking_id, payment.booking_id)).execute();
            }
        }
        return event;

    } catch (err: any) {
        throw new Error(`Webhook Error: ${err.message}`);
    }
};

//
export const updateBookingAndPaymentStatus = async (transactionId: string) => {
    try {
        await db.transaction(async (trx) => {
            const payment = await trx.select()
                .from(paymentsTable)
                .where(eq(paymentsTable.transaction_id, transactionId))
                .limit(1)
                .execute();

            if (payment.length === 0) {
                throw new Error('Payment not found');
            }

            const bookingId = payment[0].booking_id;

            await trx.update(paymentsTable)
                .set({ payment_status: 'Completed' })
                .where(eq(paymentsTable.transaction_id, transactionId))
                .execute();

            await trx.update(bookingsTable)
                .set({ booking_status: 'Completed' })
                .where(eq(bookingsTable.booking_id, bookingId))
                .execute();
        });

        return "Booking and payment status updated successfully";
    } catch (err) {
        throw err;
    }
};