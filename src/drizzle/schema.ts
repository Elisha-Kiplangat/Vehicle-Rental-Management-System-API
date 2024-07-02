import { pgTable, text, varchar, serial, boolean, real, date, primaryKey, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const roleEnum = pgEnum ('role', ["admin", "user"]);

export const usersTable = pgTable("users", {
    user_id: serial("user_id").primaryKey(),
    full_name: varchar("full_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    contact_phone: varchar("contact_phone", { length: 20 }).notNull(),
    address: text("address").notNull(),
    role: roleEnum("role").default("user"),
    created_at: date("created_at").notNull().defaultNow(),
    updated_at: date("updated_at").notNull()
});

export const authenticationTable = pgTable("authentication", {
    auth_id: serial("auth_id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => usersTable.user_id),
    password: varchar("password", { length: 255 }).notNull(),
    created_at: date("created_at").notNull().defaultNow(),
    updated_at: date("updated_at").notNull()
});

export const vehiclesTable = pgTable("vehicles", {
    vehicle_id: serial("vehicleSpec_id").primaryKey(),
    vehicle_specs_id: integer("vehicle_id").notNull().references(() => vehicleSpecsTable.vehicle_specs_id),
    rental_rate: real("rental_rate").notNull(),
    availability: boolean("availability").notNull(),
    created_at: date("created_at").notNull().defaultNow(),
    updated_at: date("updated_at").notNull()
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
    booking_date: date("booking_date").notNull(),
    return_date: date("return_date").notNull(),
    total_amount: real("total_amount").notNull(),
    booking_status: varchar("booking_status", { length: 50 }).default("Pending").notNull(),
    created_at: date("created_at").notNull().defaultNow(),
    updated_at: date("updated_at").notNull()
});

export const paymentsTable = pgTable("payments", {
    payment_id: serial("payment_id").primaryKey(),
    booking_id: integer("booking_id").notNull().references(() => bookingsTable.booking_id),
    amount: real("amount").notNull(),
    payment_status: varchar("payment_status", { length: 50 }).default("Pending").notNull(),
    payment_date: date("payment_date").notNull(),
    payment_method: varchar("payment_method", { length: 50 }).notNull(),
    transaction_id: varchar("transaction_id", { length: 255 }).notNull(),
    created_at: date("created_at").notNull().defaultNow(),
    updated_at: date("updated_at").notNull()
});

export const customerSupportTicketsTable = pgTable("customer_support_tickets", {
    ticket_id: serial("ticket_id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => usersTable.user_id),
    subject: varchar("subject", { length: 255 }).notNull(),
    description: text("description").notNull(),
    status: varchar("status", { length: 50 }).notNull(),
    created_at: date("created_at").notNull().defaultNow(),
    updated_at: date("updated_at").notNull()
});

export const locationsTable = pgTable("locations", {
    location_id: serial("location_id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    address: text("address").notNull(),
    created_at: date("created_at").notNull().defaultNow(),
    updated_at: date("updated_at").notNull()
});

export const branchesTable = pgTable("branches", {
    branch_id: serial('branch_id').primaryKey(),
    name: varchar ("name", { length: 255}).notNull(),
    location_id: integer("location_id").notNull(). references(() => locationsTable.location_id),
    contact_phone: varchar("contact_phone", { length: 20 }).notNull(),
    created_at: date("created_at").notNull().defaultNow(),
    updated_at: date("updated_at").notNull()
})

export const fleetManagementTable = pgTable("fleet_management", {
    fleet_id: serial("fleet_id").primaryKey(),
    vehicle_id: integer("vehicle_id").notNull().references(() => vehiclesTable.vehicle_id),
    acquisition_date: date("acquisition_date").notNull(),
    depreciation_rate: real("depreciation_rate").notNull(),
    current_value: real("current_value").notNull(),
    maintenance_cost: real("maintenance_cost").notNull(),
    status: varchar("status", { length: 50 }).notNull(),
    created_at: date("created_at").notNull().defaultNow(),
    updated_at: date("updated_at").notNull(),
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

