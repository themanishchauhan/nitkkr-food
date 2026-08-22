import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { boolean, decimal, integer, json, pgTable, serial, text, time, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
//#region src/lib/schema.ts
var schema_exports = /* @__PURE__ */ __exportAll({
	categories: () => categories,
	menuItems: () => menuItems,
	stallInvites: () => stallInvites,
	stallMembers: () => stallMembers,
	vendors: () => vendors
});
var vendors = pgTable("vendors", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 100 }).notNull(),
	slug: varchar("slug", { length: 100 }).notNull().unique(),
	phone: varchar("phone", { length: 15 }).notNull(),
	whatsapp: varchar("whatsapp", { length: 15 }),
	address: text("address").notNull(),
	latitude: decimal("latitude", {
		precision: 9,
		scale: 6
	}),
	longitude: decimal("longitude", {
		precision: 9,
		scale: 6
	}),
	opensAt: time("opens_at").notNull(),
	closesAt: time("closes_at").notNull(),
	deliversTo: json("delivers_to").$type().default([]).notNull(),
	image: varchar("image", { length: 500 }),
	isActive: boolean("is_active").default(true).notNull(),
	isFeatured: boolean("is_featured").default(false).notNull(),
	displayOrder: integer("display_order").default(0).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => ({
	slugIdx: uniqueIndex("vendors_slug_idx").on(table.slug),
	activeIdx: uniqueIndex("vendors_active_idx").on(table.isActive)
}));
var categories = pgTable("categories", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 50 }).notNull(),
	slug: varchar("slug", { length: 50 }).notNull().unique(),
	icon: varchar("icon", { length: 50 }).notNull(),
	displayOrder: integer("display_order").default(0).notNull()
});
var menuItems = pgTable("menu_items", {
	id: serial("id").primaryKey(),
	vendorId: integer("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
	categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
	name: varchar("name", { length: 100 }).notNull(),
	description: text("description"),
	price: decimal("price", {
		precision: 6,
		scale: 2
	}).notNull(),
	image: varchar("image", { length: 500 }),
	isVeg: boolean("is_veg").default(true).notNull(),
	isAvailable: boolean("is_available").default(true).notNull(),
	tags: json("tags").$type().default([]).notNull(),
	displayOrder: integer("display_order").default(0).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => ({
	vendorIdx: uniqueIndex("menu_items_vendor_idx").on(table.vendorId),
	availableIdx: uniqueIndex("menu_items_available_idx").on(table.isAvailable)
}));
var stallInvites = pgTable("stall_invites", {
	id: serial("id").primaryKey(),
	vendorId: integer("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
	token: varchar("token", { length: 64 }).notNull().unique(),
	email: varchar("email", { length: 255 }),
	phone: varchar("phone", { length: 20 }),
	expiresAt: timestamp("expires_at"),
	usedAt: timestamp("used_at"),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => ({
	tokenIdx: uniqueIndex("stall_invites_token_idx").on(table.token),
	vendorIdx: uniqueIndex("stall_invites_vendor_idx").on(table.vendorId)
}));
var stallMembers = pgTable("stall_members", {
	id: serial("id").primaryKey(),
	vendorId: integer("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
	name: varchar("name", { length: 100 }).notNull(),
	phone: varchar("phone", { length: 20 }).notNull(),
	inviteId: integer("invite_id").references(() => stallInvites.id),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
//#endregion
//#region src/lib/db.ts
var pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
	max: 10,
	idleTimeoutMillis: 3e4,
	connectionTimeoutMillis: 5e3
});
var db = drizzle(pool, { schema: schema_exports });
//#endregion
export { stallMembers as a, stallInvites as i, categories as n, vendors as o, menuItems as r, db as t };
