import { Context } from "hono";
import { getAllPaymentService, onePaymentService, addPaymentService, updatePaymentService, deletePaymentService, createCheckoutSession, createBookingAndPayment, updateBookingAndPaymentStatus } from "./payments.service";

export const getAllPaymentsController = async (c: Context) => {
    try {
        const limit = Number(c.req.query('limit'));
        const payments = await getAllPaymentService(limit);
        if (payments == null || payments.length == 0) {
            return c.text("No payments found", 404);
        }
        return c.json(payments);
    }
    catch (err: any) {
        console.error(err)
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const onePaymentController = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")
    const payment = await onePaymentService(id);
    if (payment == null) {
        return c.text("payment not found", 404);
    }
    return c.json(payment, 200);

}

export const addPaymentController = async (c: Context) => {
    try {
        const payment = await c.req.json();
        const newpayment = await addPaymentService(payment);

        return c.json(newpayment, 201)

    }
    catch (err) {
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const updatePaymentController = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")
    const payment = await c.req.json();

    try {
        const searchedpayment = await onePaymentService(id);
        if (searchedpayment == undefined) return c.text("payment not found", 404);

        const res = await updatePaymentService(id, payment);

        if (!res) return c.text("payment not updated", 404);

        return c.json({ msg: res }, 201);
    }
    catch (err: any) {
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const deletePaymentController = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")

    try {
        const payment = await onePaymentService(id);
        if (payment == undefined) return c.text("payment not found", 404);

        const res = await deletePaymentService(id);
        if (!res) return c.text("payment not deleted", 404);

        return c.json({ msg: res }, 201);

    }
    catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

//

export const createBookingAndPaymentHandler = async (c: Context) => {
    const data = await c.req.json();
    try {
        const result = await createBookingAndPayment(data);
        return c.json({ message: result }, 201);
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
};

//

import { createPaymentIntent, handleWebhook } from './payments.service';


export const createPaymentIntentHandler = async (c: Context) => {
    try {
        const body = await c.req.json();
        const { amount, currency, booking_id } = body;

        if (!amount || !currency || !booking_id) {
            return c.json({ error: 'Amount, currency, and booking ID are required' }, 400);
        }

        const paymentIntent = await createPaymentIntent(amount, currency, booking_id);
        return c.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
        console.error('Error creating payment intent:', error.message);
        return c.json({ error: error.message }, 400);
    }
};

export const createCheckoutSessionHandler = async (c: Context) => {
    try {
        const body = await c.req.json();
        const { amount, currency, booking_id } = body;

        if (!amount || !currency || !booking_id) {
            return c.json({ error: 'Amount, currency, and booking ID are required' }, 400);
        }

        const session = await createCheckoutSession(amount, currency, booking_id);
        const checkoutUrl = session.url;

        return c.json({ sessionId: session.id, checkoutUrl: checkoutUrl });
    } catch (error: any) {
        console.error('Error creating checkout session:', error.message);
        return c.json({ error: error.message }, 400);
    }
};


export const webhookHandler = async (c: Context) => {
    const payload = await c.req.text();
    const sig = c.req.header('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

    if (!sig) {
        console.error('Error: Missing Stripe signature');
        return c.text('Missing Stripe signature', 400);
    }

    try {
        const event = await handleWebhook(payload, sig, webhookSecret);
        return c.text('Received');
    } catch (error: any) {
        console.error(`Webhook Error: ${error.message}`);
        return c.text(error.message, 400);
    }
};

export const successHandler = async (c: Context) => {
    try {
        const transactionId = c.req.query('transaction_id'); 

        if (!transactionId) {
            return c.text('Transaction ID is required', 400);
        }

        await updateBookingAndPaymentStatus(transactionId);

        return c.redirect('/bookings');
    } catch (error: any) {
        console.error('Error updating booking and payment status:', error.message);
        return c.text('Failed to update booking and payment status', 500);
    }
};

export const cancelHandler = async (c: Context) => {
    return c.text('Payment cancelled! Try again.');
};