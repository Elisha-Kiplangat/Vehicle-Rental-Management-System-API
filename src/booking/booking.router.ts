import { Hono } from "hono";
import { getAllBookingsController, oneBookingController, addBookingController, updateBookingController, deleteBookingController } from "./booking.controller";
import { zValidator } from "@hono/zod-validator";
import { bookingSchema } from "../validators";
import { adminRoleAuth, userRoleAuth, allRoleAuth } from "../middleware/bearAuth";

export const bookingsRouter = new Hono();

bookingsRouter.get("/bookings", adminRoleAuth, getAllBookingsController);

bookingsRouter.get("/bookings/:id", allRoleAuth, oneBookingController)

bookingsRouter.post("/bookings", userRoleAuth, zValidator('json', bookingSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), addBookingController)

bookingsRouter.put("/bookings/:id", allRoleAuth, updateBookingController)

bookingsRouter.delete("/bookings/delete/:id", allRoleAuth, deleteBookingController)