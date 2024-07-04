import { Hono } from "hono";
import { getAllBookingsController, oneBookingController, addBookingController, updateBookingController, deleteBookingController } from "./booking.controller";
import { zValidator } from "@hono/zod-validator";
import { bookingSchema } from "../validators";

export const bookingsRouter = new Hono();

bookingsRouter.get("/bookings", getAllBookingsController);

bookingsRouter.get("/bookings/:id", oneBookingController)

bookingsRouter.post("/bookings", zValidator('json', bookingSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), addBookingController)

bookingsRouter.put("/bookings/:id", updateBookingController)

bookingsRouter.delete("/bookings/delete/:id", deleteBookingController)