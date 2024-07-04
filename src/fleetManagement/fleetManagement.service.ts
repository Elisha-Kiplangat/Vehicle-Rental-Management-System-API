import { fleetInsert, fleetSelect, fleetManagementTable } from "../drizzle/schema";
import db from "../drizzle/db";
import { eq } from 'drizzle-orm'


export const getAllFleetManagementService = async (limit?: number): Promise<fleetSelect[]> => {
    try {
        if (limit) {
            const fleetManagement = await db.query.fleetManagementTable.findMany({
                limit: limit
            })
            return fleetManagement;
        }
        return await db.query.fleetManagementTable.findMany();
    }
    catch (err) {
        throw err;
    }
}

export const oneFleetManagementService = async (id: number): Promise<fleetSelect | undefined> => {
    return await db.query.fleetManagementTable.findFirst({
        where: eq(fleetManagementTable.fleet_id, id)
    });
}

export const addFleetManagementService = async (fleetManagements: fleetSelect) => {
    await db.insert(fleetManagementTable).values(fleetManagements);
    return "fleet added successfully";
}

export const updateFleetManagementService = async (id: number, fleetManagements: fleetInsert) => {
    try {
        const fleetManagementSearched = await oneFleetManagementService(id);
        if (!fleetManagementSearched) {
            return false;
        }
        await db.update(fleetManagementTable).set(fleetManagements).where(eq(fleetManagementTable.fleet_id, id));
        return "fleet updated successfully";

    }
    catch (err) {
        throw err;
    }
}

export const deleteFleetManagementService = async (id: number) => {
    await db.delete(fleetManagementTable).where(eq(fleetManagementTable.fleet_id, id));
    return "fleet deleted successfully"
}