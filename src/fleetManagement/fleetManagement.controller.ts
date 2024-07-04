import { Context } from "hono";
import { getAllFleetManagementService, oneFleetManagementService, addFleetManagementService, updateFleetManagementService, deleteFleetManagementService } from "./fleetManagement.service";

export const getAllFleetManagementsController = async (c: Context) => {
    try {
        const limit = Number(c.req.query('limit'));
        const fleetManagement = await getAllFleetManagementService(limit);
        if (fleetManagement == null || fleetManagement.length == 0) {
            return c.text("No fleet found", 404);
        }
        return c.json(fleetManagement);
    }
    catch (err: any) {
        console.error(err)
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const oneFleetManagementController = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")
    const fleetManagement = await oneFleetManagementService(id);
    if (fleetManagement == null) {
        return c.text("fleet not found", 404);
    }
    return c.json(fleetManagement, 200);

}

export const addFleetManagementController = async (c: Context) => {
    try {
        const fleetManagement = await c.req.json();
        const newfleetManagement = await addFleetManagementService(fleetManagement);

        return c.json(newfleetManagement, 201)

    }
    catch (err) {
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const updateFleetManagementController = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")
    const fleetManagement = await c.req.json();

    try {
        const searchedfleet = await oneFleetManagementService(id);
        if (searchedfleet == undefined) return c.text("fleetManagement not found", 404);

        const res = await updateFleetManagementService(id, fleetManagement);

        if (!res) return c.text("fleet not updated", 404);

        return c.json({ msg: res }, 201);
    }
    catch (err: any) {
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const deleteFleetManagementController = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")

    try {
        const fleetManagement = await oneFleetManagementService(id);
        if (fleetManagement == undefined) return c.text("fleet not found", 404);

        const res = await deleteFleetManagementService(id);
        if (!res) return c.text("fleet not deleted", 404);

        return c.json({ msg: res }, 201);

    }
    catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}