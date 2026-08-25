import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const vendors = sqliteTable('vendors', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  phone: text('phone').notNull(),
  whatsapp: text('whatsapp'),
  address: text('address').notNull(),
  latitude: real('latitude'),
  longitude: real('longitude'),
  opensAt: text('opens_at').notNull(),
  closesAt: text('closes_at').notNull(),
  deliversTo: text('delivers_to', { mode: 'json' }).$type<string[]>().default([]).notNull(),
  image: text('image'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  isFeatured: integer('is_featured', { mode: 'boolean' }).default(false).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP').notNull(),
});

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  icon: text('icon').notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
});

export const menuItems = sqliteTable('menu_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vendorId: integer('vendor_id').references(() => vendors.id, { onDelete: 'cascade' }).notNull(),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  description: text('description'),
  price: real('price').notNull(),
  image: text('image'),
  isVeg: integer('is_veg', { mode: 'boolean' }).default(true).notNull(),
  isAvailable: integer('is_available', { mode: 'boolean' }).default(true).notNull(),
  tags: text('tags', { mode: 'json' }).$type<string[]>().default([]).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP').notNull(),
});

export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  menuItemId: integer('menu_item_id').references(() => menuItems.id, { onDelete: 'cascade' }).notNull(),
  studentName: text('student_name').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP').notNull(),
});

export const siteSettings = sqliteTable('site_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

export type Vendor = typeof vendors.$inferSelect;
export type NewVendor = typeof vendors.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type MenuItem = typeof menuItems.$inferSelect;
export type NewMenuItem = typeof menuItems.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type NewSiteSetting = typeof siteSettings.$inferInsert;