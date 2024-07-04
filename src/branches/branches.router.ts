import { Hono } from "hono";
import { getAllBranchsController, oneBranchController, addBranchController, updateBranchController, deleteBranchController } from "./branches.controller";
import { zValidator } from "@hono/zod-validator";
import { branchSchema } from "../validators";
import { adminRoleAuth, userRoleAuth, allRoleAuth } from "../middleware/bearAuth";

export const branchesRouter = new Hono();

branchesRouter.get("/branches", adminRoleAuth, getAllBranchsController);

branchesRouter.get("/branches/:id", allRoleAuth, oneBranchController)

branchesRouter.post("/branches", adminRoleAuth, zValidator('json', branchSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), addBranchController)

branchesRouter.put("/branches/:id", adminRoleAuth, updateBranchController)

branchesRouter.delete("/branches/delete/:id", adminRoleAuth, deleteBranchController)