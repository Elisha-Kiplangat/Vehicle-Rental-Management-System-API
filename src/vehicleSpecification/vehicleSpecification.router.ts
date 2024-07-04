import { Hono } from "hono";
import { getAllVehicleSpecssController, oneVehicleSpecsController, addVehicleSpecsController, updateVehicleSpecsController, deleteVehicleSpecsController } from "./vehicleSpecification.controller";
import { zValidator } from "@hono/zod-validator";
import { vehicleSpecsSchema } from "../validators";
import { adminRoleAuth, allRoleAuth } from "../middleware/bearAuth";

export const vehicleSpecsRouter = new Hono();

vehicleSpecsRouter.get("/vehicleSpecifications", allRoleAuth, getAllVehicleSpecssController);

vehicleSpecsRouter.get("/vehicleSpecifications/:id", allRoleAuth, oneVehicleSpecsController)

vehicleSpecsRouter.post("/vehicleSpecifications", adminRoleAuth, zValidator('json', vehicleSpecsSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), addVehicleSpecsController)

vehicleSpecsRouter.put("/vehicleSpecifications/:id", adminRoleAuth, updateVehicleSpecsController)

vehicleSpecsRouter.delete("/vehicleSpecifications/delete/:id", adminRoleAuth, deleteVehicleSpecsController)