import { pgTable, text, varchar, serial, boolean, real, date, timestamp, primaryKey, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const roleEnum = pgEnum ('role', ["admin", "user"]);

export const usersTable = pgTable("users", {
    user_id: serial("user_id").primaryKey(),
    full_name: varchar("full_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    contact_phone: varchar("contact_phone", { length: 20 }).notNull(),
    address: text("address").notNull(),
    role: roleEnum("role").default("user"),
    created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull().defaultNow()
});

export const authenticationTable = pgTable("authentication", {
    auth_id: serial("auth_id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => usersTable.user_id),
    password: varchar("password", { length: 255 }).notNull(),
    created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull().defaultNow()
});

export const vehiclesTable = pgTable("vehicles", {
    vehicle_id: serial("vehicleSpec_id").primaryKey(),
    vehicle_specs_id: integer("vehicle_id").notNull().references(() => vehicleSpecsTable.vehicle_specs_id),
    rental_rate: real("rental_rate").notNull(),
    availability: boolean("availability").notNull(),
    created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull().defaultNow()
});

export const vehicleSpecsTable = pgTable("vehicle_specifications", {
    vehicle_specs_id: serial("vehicle_specs_id").primaryKey(),
    manufacturer: varchar("manufacturer", { length: 255 }).notNull(),
    model: varchar("model", { length: 255 }).notNull(),
    year: integer("year").notNull(),
    fuel_type: varchar("fuel_type", { length: 50 }).notNull(),
    engine_capacity: varchar("engine_capacity", { length: 50 }).notNull(),
    transmission: varchar("transmission", { length: 50 }).notNull(),
    seating_capacity: integer("seating_capacity").notNull(),
    color: varchar("color", { length: 50 }).notNull(),
    features: text("features").notNull()
});

export const bookingsTable = pgTable("bookings", {
    booking_id: serial("booking_id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => usersTable.user_id),
    vehicle_id: integer("vehicle_id").notNull().references(() => vehiclesTable.vehicle_id),
    location_id: integer("location_id").notNull().references(() => locationsTable.location_id),
    booking_date: timestamp("booking_date", { mode: "string" }).notNull().defaultNow(),
    return_date: timestamp("return_date", { mode: "string" }).notNull().defaultNow(),
    total_amount: real("total_amount").notNull(),
    booking_status: varchar("booking_status", { length: 50 }).default("Pending").notNull(),
    created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull().defaultNow()
});

export const paymentsTable = pgTable("payments", {
    payment_id: serial("payment_id").primaryKey(),
    booking_id: integer("booking_id").notNull().references(() => bookingsTable.booking_id),
    amount: real("amount").notNull(),
    payment_status: varchar("payment_status", { length: 50 }).default("Pending").notNull(),
    payment_date: timestamp("payment_date", { mode: "string" }).notNull().defaultNow(),
    payment_method: varchar("payment_method", { length: 50 }).notNull(),
    transaction_id: varchar("transaction_id", { length: 255 }).notNull(),
    created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull().defaultNow()
});

export const customerSupportTicketsTable = pgTable("customer_support_tickets", {
    ticket_id: serial("ticket_id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => usersTable.user_id),
    subject: varchar("subject", { length: 255 }).notNull(),
    description: text("description").notNull(),
    status: varchar("status", { length: 50 }).notNull(),
    created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull().defaultNow()
});

export const locationsTable = pgTable("locations", {
    location_id: serial("location_id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    address: text("address").notNull(),
    created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull().defaultNow()
});

export const branchesTable = pgTable("branches", {
    branch_id: serial('branch_id').primaryKey(),
    name: varchar ("name", { length: 255}).notNull(),
    location_id: integer("location_id").notNull(). references(() => locationsTable.location_id),
    contact_phone: varchar("contact_phone", { length: 20 }).notNull(),
    created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull().defaultNow()
})

export const fleetManagementTable = pgTable("fleet_management", {
    fleet_id: serial("fleet_id").primaryKey(),
    vehicle_id: integer("vehicle_id").notNull().references(() => vehiclesTable.vehicle_id),
    acquisition_date: timestamp("acquisition_date", { mode: "string" }).notNull().defaultNow(),
    depreciation_rate: real("depreciation_rate").notNull(),
    current_value: real("current_value").notNull(),
    maintenance_cost: real("maintenance_cost").notNull(),
    status: varchar("status", { length: 50 }).notNull(),
    created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull().defaultNow()
});


// Relationships

export const usersTableRelation = relations(usersTable, ({ one, many }) => ({
    authentication: one(authenticationTable, {
        fields: [usersTable.user_id],
        references: [authenticationTable.user_id]
    }),
    bookings: many(bookingsTable),
    customerSupportTickets: many(customerSupportTicketsTable)
}));

export const authenticationTableRelation = relations(authenticationTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [authenticationTable.user_id],
        references: [usersTable.user_id]
    })
}));

export const vehicleSpecsTableRelation = relations(vehicleSpecsTable, ({ many }) => ({
    vehicles: many(vehiclesTable)
}));

export const vehiclesTableRelation = relations(vehiclesTable, ({ one, many }) => ({
    vehicle_spec: one(vehicleSpecsTable, {
        fields: [vehiclesTable.vehicle_specs_id],
        references: [vehicleSpecsTable.vehicle_specs_id]
    }),
    bookings: many(bookingsTable),
    fleetManagement: many(fleetManagementTable)
}));

export const bookingsTableRelation = relations(bookingsTable, ({ one, many }) => ({
    user: one(usersTable, {
        fields: [bookingsTable.user_id],
        references: [usersTable.user_id]
    }),
    vehicle: one(vehiclesTable, {
        fields: [bookingsTable.vehicle_id],
        references: [vehiclesTable.vehicle_id]
    }),
    location: one(locationsTable, {
        fields: [bookingsTable.location_id],
        references: [locationsTable.location_id]
    }),
    payments: many(paymentsTable)
}));

export const paymentsTableRelation = relations(paymentsTable, ({ one }) => ({
    booking: one(bookingsTable, {
        fields: [paymentsTable.booking_id],
        references: [bookingsTable.booking_id]
    })
}));

export const customerSupportTicketsTableRelation = relations(customerSupportTicketsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [customerSupportTicketsTable.user_id],
        references: [usersTable.user_id]
    })
}));

export const branchesTableRelation = relations(branchesTable, ({ one }) => ({
    location: one(locationsTable, {
        fields: [branchesTable.location_id],
        references: [locationsTable.location_id]
    })
}));

export const fleetManagementTableRelation = relations(fleetManagementTable, ({ one }) => ({
    vehicle: one(vehiclesTable, {
        fields: [fleetManagementTable.vehicle_id],
        references: [vehiclesTable.vehicle_id]
    })
}));

export const locationsTableRelation = relations(locationsTable, ({ many }) => ({
    bookings: many(bookingsTable),
    branches: many(branchesTable)
}));

export type userInsert = typeof usersTable.$inferInsert;
export type userSelect = typeof usersTable.$inferSelect;

export type authInsert = typeof authenticationTable.$inferInsert;
export type authSelect = typeof authenticationTable.$inferSelect;

export type vehicleInsert = typeof vehiclesTable.$inferInsert;
export type vehicleSelect = typeof vehiclesTable.$inferSelect;

export type vehicleSpecsInsert = typeof vehicleSpecsTable.$inferInsert;
export type vehicleSpecsSelect = typeof vehicleSpecsTable.$inferSelect;

export type bookingsInsert = typeof bookingsTable.$inferInsert;
export type bookingsSelect = typeof bookingsTable.$inferSelect;

export type paymentInsert = typeof paymentsTable.$inferInsert;
export type paymentSelect = typeof paymentsTable.$inferSelect;

export type costomerSupportInsert = typeof customerSupportTicketsTable.$inferInsert;
export type custommerSupportSelect = typeof customerSupportTicketsTable.$inferSelect;

export type locationInsert = typeof locationsTable.$inferInsert;
export type locationSelect = typeof locationsTable.$inferSelect;

export type branchesInsert = typeof branchesTable.$inferInsert;
export type branchesSelect = typeof branchesTable.$inferSelect;

export type fleetInsert = typeof fleetManagementTable.$inferInsert;
export type fleetSelect = typeof fleetManagementTable.$inferSelect;







