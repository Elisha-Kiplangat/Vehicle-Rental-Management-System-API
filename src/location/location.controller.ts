import { Context } from "hono";
import { getAllLocationService, oneLocationService, addLocationService, updateLocationService, deleteLocationService } from "./location.service";

export const getAllLocationsController = async (c: Context) => {
    try {
        const limit = Number(c.req.query('limit'));
        const locations = await getAllLocationService(limit);
        if (locations == null || locations.length == 0) {
            return c.text("No location found", 404);
        }
        return c.json(locations);
    }
    catch (err: any) {
        console.error(err)
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const oneLocationController = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")
    const location = await oneLocationService(id);
    if (location == null) {
        return c.text("location not found", 404);
    }
    return c.json(location, 200);

}

export const addLocationController = async (c: Context) => {
    try {
        const location = await c.req.json();
        const newlocation = await addLocationService(location);

        return c.json(newlocation, 201)

    }
    catch (err) {
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const updateLocationController = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")
    const location = await c.req.json();

    try {
        const searchedLocation = await oneLocationService(id);
        if (searchedLocation == undefined) return c.text("location not found", 404);

        const res = await updateLocationService(id, location);

        if (!res) return c.text("location not updated", 404);

        return c.json({ msg: res }, 201);
    }
    catch (err: any) {
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const deleteLocationController = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")

    try {
        const location = await oneLocationService(id);
        if (location == undefined) return c.text("location not found", 404);

        const res = await deleteLocationService(id);
        if (!res) return c.text("location not deleted", 404);

        return c.json({ msg: res }, 201);

    }
    catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}