import { vehicleDetails, vehicleInsert, vehicleSelect, vehiclesTable, vehicleSpecsSelect, vehicleSpecsTable } from "../drizzle/schema";
import db from "../drizzle/db";
import { eq, count } from 'drizzle-orm'


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


export const vehicleDetailsService = async (): Promise<vehicleDetails> => {
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
                    vehicle_type:true,
                    model: true,
                    fuel_type: true,
                    seating_capacity: true
                }
            }
        },
        
    })
}

interface Tvehicle {
    vehicle_id?: number;
    created_at?: string;
    updated_at?: string;
    vehicle_specification_id: number;
    rental_rate: number;
    availability: boolean;
}

interface TvehicleSpecs {
    vehicle_type: string;
    manufacturer: string;
    model: string;
    year: number;
    fuel_type: string;
    engine_capacity: string;
    transmission: string;
    seating_capacity: number;
    color: string;
    features: string;
}

export const addVehicleWithDetailsService = async (vehicle: Tvehicle,vehicleSpecs: TvehicleSpecs) => {
    
    const vehicleSpecsResult = await db.insert(vehicleSpecsTable).values(vehicleSpecs).returning({ vehicle_specification_id: vehicleSpecsTable.vehicle_specification_id });
    const vehicleSpecsId = vehicleSpecsResult[0].vehicle_specification_id;

    vehicle.vehicle_specification_id = vehicleSpecsId;

    await db.insert(vehiclesTable).values(vehicle)

    return "Vehicle with specifications added successfully";
};

export const updateVehicleDetailService = async (id: number, vehicle: Tvehicle, vehicleSpecs: TvehicleSpecs) => {
    try {
        
        const vehicleSearched = await oneVehicleService(id);
        if (!vehicleSearched) {
            return false;
        }

        await db.update(vehiclesTable)
            .set(vehicle)
            .where(eq(vehiclesTable.vehicle_id, id));

        await db.update(vehicleSpecsTable)
            .set(vehicleSpecs)
            .where(eq(vehicleSpecsTable.vehicle_specification_id, vehicle.vehicle_specification_id));

        return "Vehicle and vehicle specs updated successfully";

    } catch (err) {
        throw err;
    }
}



export const getTotalVehicles = async () => {
    const result =
        await db.select({ count: count() }).from(vehiclesTable);
    return result;
};
