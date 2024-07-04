import { Hono } from "hono";
import { getAllFleetManagementsController, oneFleetManagementController, addFleetManagementController, updateFleetManagementController, deleteFleetManagementController } from "./fleetManagement.controller";
import { zValidator } from "@hono/zod-validator";
import { fleetSchema } from "../validators";
import { adminRoleAuth, userRoleAuth, allRoleAuth } from "../middleware/bearAuth";

export const fleetRouter = new Hono();

fleetRouter.get("/fleets", adminRoleAuth, getAllFleetManagementsController);

fleetRouter.get("/fleets/:id", adminRoleAuth, oneFleetManagementController)

fleetRouter.post("/fleets",adminRoleAuth, zValidator('json', fleetSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), addFleetManagementController)

fleetRouter.put("/fleets/:id", adminRoleAuth, updateFleetManagementController)

fleetRouter.delete("/fleets/delete/:id", adminRoleAuth, deleteFleetManagementController)