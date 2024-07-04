import { Context } from "hono";
import { getAllPaymentService, onePaymentService, addPaymentService, updatePaymentService, deletePaymentService } from "./payments.service";

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