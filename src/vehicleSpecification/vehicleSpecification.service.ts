import { vehicleSpecsInsert, vehicleSpecsSelect, vehicleSpecsTable } from "../drizzle/schema";
import db from "../drizzle/db";
import { eq } from 'drizzle-orm'


export const getAllVehicleSpecsService = async (limit?: number): Promise<vehicleSpecsSelect[]> => {
    try {
        if (limit) {
            const vehicleSpecs = await db.query.vehicleSpecsTable.findMany({
                limit: limit
            })
            return vehicleSpecs;
        }
        return await db.query.vehicleSpecsTable.findMany();
    }
    catch (err) {
        throw err;
    }
}

export const oneVehicleSpecsService = async (id: number): Promise<vehicleSpecsSelect | undefined> => {
    return await db.query.vehicleSpecsTable.findFirst({
        where: eq(vehicleSpecsTable.vehicle_specs_id, id)
    });
}

export const addVehicleSpecsService = async (vehicleSpecs: vehicleSpecsSelect) => {
    await db.insert(vehicleSpecsTable).values(vehicleSpecs);
    return "vehicleSpecs added successfully";
}

export const updateVehicleSpecsService = async (id: number, vehicleSpecs: vehicleSpecsInsert) => {
    try {
        const vehicleSpecsSearched = await oneVehicleSpecsService(id);
        if (!vehicleSpecsSearched) {
            return false;
        }
        await db.update(vehicleSpecsTable).set(vehicleSpecs).where(eq(vehicleSpecsTable.vehicle_specs_id, id));
        return "vehicleSpecs updated successfully";

    }
    catch (err) {
        throw err;
    }
}

export const deleteVehicleSpecsService = async (id: number) => {
    await db.delete(vehicleSpecsTable).where(eq(vehicleSpecsTable.vehicle_specs_id, id));
    return "vehicleSpecs deleted successfully"
}