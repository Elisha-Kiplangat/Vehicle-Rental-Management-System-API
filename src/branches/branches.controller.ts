import { Context } from "hono";
import { getAllBranchService, oneBranchService, addBranchService, updateBranchService, deleteBranchService } from "./branches.service";

export const getAllBranchsController = async (c: Context) => {
    try {
        const limit = Number(c.req.query('limit'));
        const branch = await getAllBranchService(limit);
        if (branch == null || branch.length == 0) {
            return c.text("No branch found", 404);
        }
        return c.json(branch);
    }
    catch (err: any) {
        console.error(err)
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const oneBranchController = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")
    const branch = await oneBranchService(id);
    if (branch == null) {
        return c.text("branch not found", 404);
    }
    return c.json(branch, 200);

}

export const addBranchController = async (c: Context) => {
    try {
        const branch = await c.req.json();
        const newbranch = await addBranchService(branch);

        return c.json(newbranch, 201)

    }
    catch (err) {
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const updateBranchController = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")
    const branch = await c.req.json();

    try {
        const searchedbranch = await oneBranchService(id);
        if (searchedbranch == undefined) return c.text("branch not found", 404);

        const res = await updateBranchService(id, branch);

        if (!res) return c.text("branch not updated", 404);

        return c.json({ msg: res }, 201);
    }
    catch (err: any) {
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const deleteBranchController = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("invalid id")

    try {
        const branch = await oneBranchService(id);
        if (branch == undefined) return c.text("branch not found", 404);

        const res = await deleteBranchService(id);
        if (!res) return c.text("branch not deleted", 404);

        return c.json({ msg: res }, 201);

    }
    catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}