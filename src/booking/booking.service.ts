import { bookingsInsert, bookingsSelect, bookingsTable } from "../drizzle/schema";
import db from "../drizzle/db";
import { eq, count, gt } from 'drizzle-orm'


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

export const oneBookingService = async (id: number): Promise<bookingsSelect[]> => {
    return await db.query.bookingsTable.findMany({
        where: eq(bookingsTable.user_id, id)
    });
}

export const addBookingService = async (bookings: bookingsSelect) => {
    const [newBooking] = await db
        .insert(bookingsTable)
        .values(bookings)
        .returning({ booking_id: bookingsTable.booking_id });
    return newBooking;
}; 

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

export const getTotalBooking = async () => {
    const result =
        await db.select({ count: count() }).from(bookingsTable);
    return result[0]?.count || 0;
};

export const getTotalActiveBookings = async () => {
    const result =
        await db.select({ count: count() })
            .from(bookingsTable)
            .where(gt(bookingsTable.return_date, new Date().toISOString()));
    return result[0]?.count || 0;
};
