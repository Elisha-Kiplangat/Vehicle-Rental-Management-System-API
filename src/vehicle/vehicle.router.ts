import { Hono } from "hono";
import { getAllVehiclesController, oneVehicleController, addVehicleController, updateVehicleController, deleteVehicleController, vehicleDetailsController, addVehicleWithDetailsController, getTotalVehiclesController, updateVehicleDetailsController } from "./vehicle.controller";
import { zValidator } from "@hono/zod-validator";
import { vehicleSchema } from "../validators";
import { adminRoleAuth, allRoleAuth } from "../middleware/bearAuth";


export const vehiclesRouter = new Hono();

vehiclesRouter.get("/vehicles", allRoleAuth, getAllVehiclesController);

vehiclesRouter.get("/vehicles/:id", allRoleAuth, oneVehicleController)

vehiclesRouter.post("/vehicles", adminRoleAuth, zValidator('json', vehicleSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), addVehicleController)

vehiclesRouter.post("/add/vehicles", adminRoleAuth, addVehicleWithDetailsController)

vehiclesRouter.put("/vehicles/:id", adminRoleAuth, updateVehicleController)

vehiclesRouter.delete("/vehicle/delete/:id", adminRoleAuth, deleteVehicleController)

vehiclesRouter.get('/vehicleDetails', allRoleAuth, vehicleDetailsController)

vehiclesRouter.get('/vehicle/totals', adminRoleAuth, getTotalVehiclesController);

vehiclesRouter.put("/vehicles/details/:id", updateVehicleDetailsController);
