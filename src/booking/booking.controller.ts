import { Context } from "hono";
import { getAllBookingService, oneBookingService, addBookingService, updateBookingService, deleteBookingService } from "./booking.service";

export const getAllBookingsController = async (c: Context) => {
    try {
        const limit = Number(c.req.query('limit'));
        const bookings = await getAllBookingService(limit);
        if (bookings == null || bookings.length == 0) {
            return c.text("No booking found", 404);
        }
        return c.json(bookings);
    }
    catch (err: any) {
        console.error(err)
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const oneBookingController = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")
    const booking = await oneBookingService(id);
    if (booking == null) {
        return c.text("booking not found", 404);
    }
    return c.json(booking, 200);

}

export const addBookingController = async (c: Context) => {
    try {
        const booking = await c.req.json();
        const newBooking = await addBookingService(booking);

        return c.json(newBooking, 201)

    }
    catch (err) {
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const updateBookingController = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")
    const booking = await c.req.json();

    try {
        const searchedBooking = await oneBookingService(id);
        if (searchedBooking == undefined) return c.text("booking not found", 404);

        const res = await updateBookingService(id, booking);

        if (!res) return c.text("booking not updated", 404);

        return c.json({ msg: res }, 201);
    }
    catch (err: any) {
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const deleteBookingController = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")

    try {
        const booking = await oneBookingService(id);
        if (booking == undefined) return c.text("booking not found", 404);

        const res = await deleteBookingService(id);
        if (!res) return c.text("booking not deleted", 404);

        return c.json({ msg: res }, 201);

    }
    catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}