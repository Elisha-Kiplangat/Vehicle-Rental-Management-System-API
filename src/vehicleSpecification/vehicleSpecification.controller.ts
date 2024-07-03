import { Context } from "hono";
import { getAllVehicleSpecsService, oneVehicleSpecsService, addVehicleSpecsService, updateVehicleSpecsService, deleteVehicleSpecsService } from "./vehicleSpecification.service";

export const getAllVehicleSpecssController = async (c: Context) => {
    try {
        const limit = Number(c.req.query('limit'));
        const vehicleSpecs = await getAllVehicleSpecsService(limit);
        if (vehicleSpecs == null || vehicleSpecs.length == 0) {
            return c.text("No vehicleSpecss found", 404);
        }
        return c.json(vehicleSpecs);
    }
    catch (err: any) {
        console.error(err)
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const oneVehicleSpecsController = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")
    const vehicleSpecs = await oneVehicleSpecsService(id);
    if (vehicleSpecs == null) {
        return c.text("vehicleSpecs not found", 404);
    }
    return c.json(vehicleSpecs, 200);

}

export const addVehicleSpecsController = async (c: Context) => {
    try {
        const vehicleSpecs = await c.req.json();
        const newvehicleSpecs = await addVehicleSpecsService(vehicleSpecs);

        return c.json(newvehicleSpecs, 201)

    }
    catch (err) {
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const updateVehicleSpecsController = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")
    const vehicleSpecs = await c.req.json();

    try {
        const searchedvehicleSpecs = await oneVehicleSpecsService(id);
        if (searchedvehicleSpecs == undefined) return c.text("vehicleSpecs not found", 404);

        const res = await updateVehicleSpecsService(id, vehicleSpecs);

        if (!res) return c.text("vehicleSpecs not updated", 404);

        return c.json({ msg: res }, 201);
    }
    catch (err: any) {
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const deleteVehicleSpecsController = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")

    try {
        const vehicleSpecs = await oneVehicleSpecsService(id);
        if (vehicleSpecs == undefined) return c.text("vehicleSpecs not found", 404);

        const res = await deleteVehicleSpecsService(id);
        if (!res) return c.text("vehicleSpecs not deleted", 404);

        return c.json({ msg: res }, 201);

    }
    catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}