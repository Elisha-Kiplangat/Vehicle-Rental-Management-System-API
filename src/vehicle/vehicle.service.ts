import { vehicleDetails, vehicleInsert, vehicleSelect, vehiclesTable } from "../drizzle/schema";
import db from "../drizzle/db";
import { eq } from 'drizzle-orm'


export const getAllVehicleService = async (limit?: number): Promise<vehicleSelect[]> => {
    try {
        if (limit) {
            const vehicles = await db.query.vehiclesTable.findMany({
                limit: limit
            })
            return vehicles;
        }
        return await db.query.vehiclesTable.findMany();
    }
    catch (err) {
        throw err;
    }
}

export const oneVehicleService = async (id: number): Promise<vehicleSelect | undefined> => {
    return await db.query.vehiclesTable.findFirst({
        where: eq(vehiclesTable.vehicle_id, id)
    });
}

export const addVehicleService = async (vehicle: vehicleSelect) => {
    await db.insert(vehiclesTable).values(vehicle);
    return "vehicle added successfully";
}

export const updateVehicleService = async (id: number, vehicle: vehicleInsert) => {
    try {
        const vehicleSearched = await oneVehicleService(id);
        if (!vehicleSearched) {
            return false;
        }
        await db.update(vehiclesTable).set(vehicle).where(eq(vehiclesTable.vehicle_id, id));
        return "vehicle updated successfully";

    }
    catch (err) {
        throw err;
    }
}

export const deleteVehicleService = async (id: number) => {
    await db.delete(vehiclesTable).where(eq(vehiclesTable.vehicle_id, id));
    return "vehicle deleted successfully"
}


export const vehicleDetailsService = async (id: number): Promise<vehicleDetails> => {
    return await db.query.vehiclesTable.findMany({
        columns: {
            vehicle_id: true,
            vehicle_specification_id: true,
            rental_rate: true,
            availability: true
        },
        with: {
            vehicle_spec: {
                columns: {
                    model: true,
                    fuel_type: true,
                    seating_capacity: true
                }
            }
        },
        where: eq(vehiclesTable.vehicle_id, id)
    })
}