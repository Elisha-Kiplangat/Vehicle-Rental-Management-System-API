import { Hono } from "hono";
import { getAllFleetManagementsController, oneFleetManagementController, addFleetManagementController, updateFleetManagementController, deleteFleetManagementController } from "./fleetManagement.controller";
import { zValidator } from "@hono/zod-validator";
import { fleetSchema } from "../validators";

export const fleetRouter = new Hono();

fleetRouter.get("/fleets", getAllFleetManagementsController);

fleetRouter.get("/fleets/:id", oneFleetManagementController)

fleetRouter.post("/fleets", zValidator('json', fleetSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), addFleetManagementController)

fleetRouter.put("/fleets/:id", updateFleetManagementController)

fleetRouter.delete("/fleets/delete/:id", deleteFleetManagementController)