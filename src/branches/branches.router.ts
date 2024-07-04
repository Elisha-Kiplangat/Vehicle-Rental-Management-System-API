import { Hono } from "hono";
import { getAllBranchsController, oneBranchController, addBranchController, updateBranchController, deleteBranchController } from "./branches.controller";
import { zValidator } from "@hono/zod-validator";
import { branchSchema } from "../validators";

export const branchesRouter = new Hono();

branchesRouter.get("/branches", getAllBranchsController);

branchesRouter.get("/branches/:id", oneBranchController)

branchesRouter.post("/branches", zValidator('json', branchSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), addBranchController)

branchesRouter.put("/branches/:id", updateBranchController)

branchesRouter.delete("/branches/delete/:id", deleteBranchController)