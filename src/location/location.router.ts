import { Hono } from "hono";
import { getAllLocationsController, oneLocationController, addLocationController, updateLocationController, deleteLocationController, locationWithBranchController } from "./location.controller";
import { zValidator } from "@hono/zod-validator";
import { locationSchema } from "../validators";
import { adminRoleAuth, allRoleAuth } from "../middleware/bearAuth";

export const locationsRouter = new Hono();

locationsRouter.get("/locations", allRoleAuth, getAllLocationsController);

locationsRouter.get("/locations/:id", allRoleAuth, oneLocationController);

locationsRouter.get("/locations-branches/:id", allRoleAuth, locationWithBranchController);

locationsRouter.post("/locations", adminRoleAuth, zValidator('json', locationSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), addLocationController)

locationsRouter.put("/locations/:id", adminRoleAuth, updateLocationController)

locationsRouter.delete("/locations/delete/:id", adminRoleAuth, deleteLocationController)