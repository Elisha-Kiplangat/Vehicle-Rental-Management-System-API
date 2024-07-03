import { Hono } from "hono";
import { getAllVehiclesController, oneVehicleController, addVehicleController, updateVehicleController, deleteVehicleController } from "./vehicle.controller";
import { zValidator } from "@hono/zod-validator";
import { vehicleSchema } from "../validators";

export const vehiclesRouter = new Hono();

vehiclesRouter.get("/vehicles", getAllVehiclesController);

vehiclesRouter.get("/vehicles/:id", oneVehicleController)

vehiclesRouter.post("/vehicles", zValidator('json', vehicleSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), addVehicleController)

vehiclesRouter.put("/vehicles/:id", updateVehicleController)

vehiclesRouter.delete("/vehicles/delete/:id", deleteVehicleController)