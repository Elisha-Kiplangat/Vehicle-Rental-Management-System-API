import { branchesInsert, branchesSelect, branchesTable } from "../drizzle/schema";
import db from "../drizzle/db";
import { eq } from 'drizzle-orm'


export const getAllBranchService = async (limit?: number): Promise<branchesSelect[]> => {
    try {
        if (limit) {
            const branchs = await db.query.branchesTable.findMany({
                limit: limit
            })
            return branchs;
        }
        return await db.query.branchesTable.findMany();
    }
    catch (err) {
        throw err;
    }
}

export const oneBranchService = async (id: number): Promise<branchesSelect | undefined> => {
    return await db.query.branchesTable.findFirst({
        where: eq(branchesTable.branch_id, id)
    });
}

export const addBranchService = async (branchs: branchesSelect) => {
    await db.insert(branchesTable).values(branchs);
    return "branch added successfully";
}

export const updateBranchService = async (id: number, branchs: branchesInsert) => {
    try {
        const branchSearched = await oneBranchService(id);
        if (!branchSearched) {
            return false;
        }
        await db.update(branchesTable).set(branchs).where(eq(branchesTable.branch_id, id));
        return "branch updated successfully";

    }
    catch (err) {
        throw err;
    }
}

export const deleteBranchService = async (id: number) => {
    await db.delete(branchesTable).where(eq(branchesTable.branch_id, id));
    return "branchs deleted successfully"
}