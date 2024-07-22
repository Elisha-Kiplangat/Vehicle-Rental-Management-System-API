import { Context } from "hono";
import { getAllVehicleService, oneVehicleService, addVehicleService, updateVehicleService, deleteVehicleService, vehicleDetailsService, addVehicleWithDetailsService, getTotalVehicles, updateVehicleDetailService } from "./vehicle.service";

export const getAllVehiclesController = async (c: Context) => {
    try {
        const limit = Number(c.req.query('limit'));
        const vehicles = await getAllVehicleService(limit);
        if (vehicles == null || vehicles.length == 0) {
            return c.text("No vehicles found", 404);
        }
        return c.json(vehicles);
    }
    catch (err: any) {
        console.error(err)
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const oneVehicleController = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")
    const vehicle = await oneVehicleService(id);
    if (vehicle == null) {
        return c.text("vehicle not found", 404);
    }
    return c.json(vehicle, 200);

}

export const addVehicleController = async (c: Context) => {
    try {
        const vehicle = await c.req.json();
        const newvehicle = await addVehicleService(vehicle);

        return c.json(newvehicle, 201)

    }
    catch (err) {
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const updateVehicleController = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")
    const vehicle = await c.req.json();

    try {
        const searchedVehicle = await oneVehicleService(id);
        if (searchedVehicle == undefined) return c.text("vehicle not found", 404);

        const res = await updateVehicleService(id, vehicle);

        if (!res) return c.text("vehicle not updated", 404);

        return c.json({ msg: res }, 201);
    }
    catch (err: any) {
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const deleteVehicleController = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")

    try {
        const vehicle = await oneVehicleService(id);
        if (vehicle == undefined) return c.text("vehicle not found", 404);

        const res = await deleteVehicleService(id);
        if (!res) return c.text("vehicle not deleted", 404);

        return c.json({ msg: res }, 201);

    }
    catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const vehicleDetailsController = async (c: Context) => {
    // const id = parseInt(c.req.param("id"));
    // if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        const vehicleDetails = await vehicleDetailsService();
        if (!vehicleDetails || vehicleDetails.length === 0) {
            return c.text("Vehicle not found", 404);
        }
        return c.json(vehicleDetails, 200);
    } catch (error) {
        console.error(error);
        return c.text("Internal Server Error", 500);
    }
};


interface VehicleSpecs {
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
    created_at?: string;
    updated_at?: string;
    vehicle_specification_id: number;
    rental_rate: number;
    availability: boolean;
}

export const addVehicleWithDetailsController = async (c: Context) => {
    try {
        const { vehicle_type, manufacturer, model, year, fuel_type, engine_capacity, transmission, seating_capacity, color, features, created_at, updated_at, vehicle_specification_id, rental_rate, availability }: VehicleSpecs = await c.req.json();

        const vehicleSpecsData = {
            vehicle_type,
            manufacturer,
            model,
            year,
            fuel_type,
            engine_capacity,
            transmission,
            seating_capacity,
            color,
            features
        };

        const vehicleData = {
            created_at,
            updated_at,
            vehicle_specification_id,
            rental_rate,
            availability,
        };

        const message = await addVehicleWithDetailsService(vehicleData, vehicleSpecsData);

        return c.json({ message }, 200);
    } catch (error: any) {
        return c.json({ error: error.message }, 500);
    }
};

export const updateVehicleDetailsController = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    let requestBody;
    try {
        requestBody = await c.req.json();
        console.log("Received request body:", requestBody);
    } catch (error) {
        console.error("Error parsing request body:", error);
        return c.text("Invalid request body", 400);
    }

    const {
        rental_rate,
        availability,
        vehicle_specification_id,
        vehicle_type,
        manufacturer,
        model,
        year,
        fuel_type,
        engine_capacity,
        transmission,
        seating_capacity,
        color,
        features
    } = requestBody;

    const vehicle = {
        rental_rate,
        availability,
        vehicle_specification_id
    };

    const vehicleSpecs = {
        vehicle_type,
        manufacturer,
        model,
        year,
        fuel_type,
        engine_capacity,
        transmission,
        seating_capacity,
        color,
        features
    };

    try {
        const res = await updateVehicleDetailService(id, vehicle, vehicleSpecs);
        if (!res) return c.text("Vehicle not updated", 404);

        return c.json({ msg: res }, 200);
    } catch (err) {
        console.error("Error updating vehicle details:", err);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
};

export const getTotalVehiclesController = async (c: Context) => {
    try {
        const totalVehicles = await getTotalVehicles();
        return c.json({ totalVehicles });
    } catch (error) {
        console.error('Failed to get total vehicles:', error);
        return c.json({ error: 'Failed to get total vehicles' }, 500);
    }
};
