import { Hono } from "hono";
import { getAllLocationsController, oneLocationController, addLocationController, updateLocationController, deleteLocationController } from "./location.controller";
import { zValidator } from "@hono/zod-validator";
import { locationSchema } from "../validators";

export const locationsRouter = new Hono();

locationsRouter.get("/locations", getAllLocationsController);

locationsRouter.get("/locations/:id", oneLocationController)

locationsRouter.post("/locations", zValidator('json', locationSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), addLocationController)

locationsRouter.put("/locations/:id", updateLocationController)

locationsRouter.delete("/locations/delete/:id", deleteLocationController)