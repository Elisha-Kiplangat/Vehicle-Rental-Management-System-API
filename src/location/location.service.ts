import { locationInsert, locationSelect, locationsTable } from "../drizzle/schema";
import db from "../drizzle/db";
import { eq } from 'drizzle-orm'


export const getAllLocationService = async (limit?: number): Promise<locationSelect[]> => {
    try {
        if (limit) {
            const locations = await db.query.locationsTable.findMany({
                limit: limit
            })
            return locations;
        }
        return await db.query.locationsTable.findMany();
    }
    catch (err) {
        throw err;
    }
}

export const oneLocationService = async (id: number): Promise<locationSelect | undefined> => {
    return await db.query.locationsTable.findFirst({
        where: eq(locationsTable.location_id, id)
    });
}

export const addLocationService = async (locations: locationSelect) => {
    try {
        await db.insert(locationsTable).values(locations);
        return "Location added successfully";
    } catch (error) {
        console.error('Error in addLocationService:', error);
        throw error;
    }
}

export const updateLocationService = async (id: number, locations: locationInsert) => {
    try {
        const locationSearched = await oneLocationService(id);
        if (!locationSearched) {
            return false;
        }
        await db.update(locationsTable).set(locations).where(eq(locationsTable.location_id, id));
        return "location updated successfully";

    }
    catch (err) {
        throw err;
    }
}

export const deleteLocationService = async (id: number) => {
    await db.delete(locationsTable).where(eq(locationsTable.location_id, id));
    return "location deleted successfully"
}