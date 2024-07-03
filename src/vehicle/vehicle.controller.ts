import { Context } from "hono";
import { getAllVehicleService, oneVehicleService, addVehicleService, updateVehicleService, deleteVehicleService } from "./vehicle.service";

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