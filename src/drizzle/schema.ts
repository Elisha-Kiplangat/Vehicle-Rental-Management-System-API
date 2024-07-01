import { pgTable, text, varchar, serial, boolean, real, date, primaryKey, integer, pgEnum } from 'drizzle-orm/pg-core';


export const roleEnum = pgEnum ('role', ["admin", "user"]);

export const usersTable = pgTable("users", {
    user_id: serial("user_id").primaryKey(),
    full_name: varchar("full_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    contact_phone: varchar("contact_phone", { length: 20 }).notNull(),
    address: text("address").notNull(),
    role: roleEnum("role").default("user"),
    created_at: date("created_at").notNull(),
    updated_at: date("updated_at").notNull(),
});

export const vehiclesTable = pgTable("vehicles", {
    vehicleSpec_id: serial("vehicleSpec_id").primaryKey(),
    vehicle_id: integer("vehicle_id").notNull().references(() => vehicleSpecsTable.vehicle_id),
    rental_rate: real("rental_rate").notNull(),
    availability: boolean("availability").notNull(),
    created_at: date("created_at").notNull(),
    updated_at: date("updated_at").notNull(),
});

export const vehicleSpecsTable = pgTable("vehicle_specifications", {
    vehicle_id: serial("vehicle_id").primaryKey(),
    manufacturer: varchar("manufacturer", { length: 255 }).notNull(),
    model: varchar("model", { length: 255 }).notNull(),
    year: integer("year").notNull(),
    fuel_type: varchar("fuel_type", { length: 50 }).notNull(),
    engine_capacity: varchar("engine_capacity", { length: 50 }).notNull(),
    transmission: varchar("transmission", { length: 50 }).notNull(),
    seating_capacity: integer("seating_capacity").notNull(),
    color: varchar("color", { length: 50 }).notNull(),
    features: text("features").notNull(),
});
