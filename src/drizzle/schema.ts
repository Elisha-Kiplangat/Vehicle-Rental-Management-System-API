import { pgTable, text, varchar, serial, boolean, real, date, primaryKey, integer, pgEnum } from 'drizzle-orm/pg-core';
import { Many, relations } from 'drizzle-orm';
import { datetime } from 'drizzle-orm/mysql-core';


export const menu_itemTable = pgTable("menu_item", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    // restaurant_id: integer("restaurant_id").notNull().references(() => restaurantTable.id, { onDelete: "cascade" }),
    // category_id: integer("category_id").notNull().references(() => categoryTable.id, { onDelete: "cascade" }),
    description: text("description").notNull(),
    ingredients: text("ingredients").notNull(),
    price: real("price").notNull(),
    active: boolean("active").notNull(),
    created_at: date("created_at").notNull(),
    updated_at: date("updated_at").notNull(),


})