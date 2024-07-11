import { TUserSupport, userInsert, userSelect, usersTable, UserWithBooking } from "../drizzle/schema";
import db from "../drizzle/db";
import { eq } from 'drizzle-orm'


export const getAllUserService = async (limit?: number): Promise<userSelect[]> => {
    try {
        if (limit) {
            const users = await db.query.usersTable.findMany({
                limit: limit
            })
            return users;
        }
        return await db.query.usersTable.findMany();
    }
    catch (err) {
        throw err;
    }
}

export const oneUserService = async (id: number): Promise<userSelect | undefined> => {
    return await db.query.usersTable.findFirst({
        where: eq(usersTable.user_id, id)
    });
}

export const addUserService = async (users: userSelect) => {
    await db.insert(usersTable).values(users);
    return "users added successfully";
}

export const updateUserService = async (id: number, users: userInsert) => {
    try {
        const usersSearched = await oneUserService(id);
        if (!usersSearched) {
            return false;
        }
        await db.update(usersTable).set(users).where(eq(usersTable.user_id, id));
        return "users updated successfully";

    }
    catch (err) {
        throw err;
    }
}

export const deleteUserService = async (id: number) => {
    await db.delete(usersTable).where(eq(usersTable.user_id, id));
    return "users deleted successfully"
}


export const userWithBookingService = async (id: number): Promise<UserWithBooking | null> => {
    return await db.query.usersTable.findMany({
        columns: {
            user_id: true,
            full_name: true,
            email: true,
            contact_phone: true,
            address: true
        },
        with: {
            
            bookings: {
                columns: {
                    booking_id: true,
                    vehicle_id: true,
                    location_id: true,
                    booking_status: true
                }
            }
        },
        where: eq(usersTable.user_id, id)
    })
}

export const userSupportService = async (id: number): Promise<TUserSupport | null> => {
    return await db.query.usersTable.findMany({
        columns: {
            user_id: true,
            full_name: true,
            email: true,
            contact_phone: true,
            address: true
        },
        with: {
            customerSupportTickets: {
                columns: {
                    ticket_id: true,
                    subject: true,
                    description: true,
                    status: true
                }
            }
        },
        where: eq(usersTable.user_id, id)
    })
}