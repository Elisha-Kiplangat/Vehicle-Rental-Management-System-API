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
