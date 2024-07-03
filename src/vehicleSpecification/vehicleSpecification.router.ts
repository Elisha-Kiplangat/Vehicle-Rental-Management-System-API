import { Hono } from "hono";
import { getAllVehicleSpecssController, oneVehicleSpecsController, addVehicleSpecsController, updateVehicleSpecsController, deleteVehicleSpecsController } from "./vehicleSpecification.controller";
import { zValidator } from "@hono/zod-validator";
import { vehicleSpecsSchema } from "../validators";

export const vehicleSpecsRouter = new Hono();

vehicleSpecsRouter.get("/vehicleSpecifications", getAllVehicleSpecssController);

vehicleSpecsRouter.get("/vehicleSpecifications/:id", oneVehicleSpecsController)

vehicleSpecsRouter.post("/vehicleSpecifications", zValidator('json', vehicleSpecsSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), addVehicleSpecsController)

vehicleSpecsRouter.put("/vehicleSpecifications/:id", updateVehicleSpecsController)

vehicleSpecsRouter.delete("/vehicleSpecifications/delete/:id", deleteVehicleSpecsController)