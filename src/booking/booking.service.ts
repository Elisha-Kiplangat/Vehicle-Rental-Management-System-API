import { bookingsInsert, bookingsSelect, bookingsTable } from "../drizzle/schema";
import db from "../drizzle/db";
import { eq } from 'drizzle-orm'


export const getAllBookingService = async (limit?: number): Promise<bookingsSelect[]> => {
    try {
        if (limit) {
            const bookings = await db.query.bookingsTable.findMany({
                limit: limit
            })
            return bookings;
        }
        return await db.query.bookingsTable.findMany();
    }
    catch (err) {
        throw err;
    }
}

export const oneBookingService = async (id: number): Promise<bookingsSelect | undefined> => {
    return await db.query.bookingsTable.findFirst({
        where: eq(bookingsTable.user_id, id)
    });
}

export const addBookingService = async (bookings: bookingsSelect) => {
    await db.insert(bookingsTable).values(bookings);
    return "booking added successfully";
}

export const updateBookingService = async (id: number, bookings: bookingsInsert) => {
    try {
        const bookingSearched = await oneBookingService(id);
        if (!bookingSearched) {
            return false;
        }
        await db.update(bookingsTable).set(bookings).where(eq(bookingsTable.booking_id, id));
        return "booking updated successfully";

    }
    catch (err) {
        throw err;
    }
}

export const deleteBookingService = async (id: number) => {
    await db.delete(bookingsTable).where(eq(bookingsTable.booking_id, id));
    return "booking deleted successfully"
}