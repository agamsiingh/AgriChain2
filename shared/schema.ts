import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull(), // farmer, processor, buyer, admin
  rating: real("rating").default(0),
  phone: text("phone"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Listings table
export const listings = pgTable("listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  type: text("type").notNull(), // soymeal, sunflower_cake, husk, specialty
  grade: text("grade").notNull(),
  quantityKg: integer("quantity_kg").notNull(),
  pricePerTon: integer("price_per_ton").notNull(),
  location: jsonb("location").notNull(), // { lat, lng, address }
  sellerId: varchar("seller_id").notNull(),
  quality: jsonb("quality").notNull(), // { moisture_pct, ash_pct, oil_pct }
  iotDeviceId: text("iot_device_id"),
  images: text("images").array().default(sql`ARRAY[]::text[]`),
  status: text("status").notNull().default('available'), // available, pending, sold
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders table
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  listingId: varchar("listing_id").notNull(),
  buyerId: varchar("buyer_id").notNull(),
  sellerId: varchar("seller_id").notNull(),
  quantityKg: integer("quantity_kg").notNull(),
  agreedPrice: integer("agreed_price").notNull(),
  status: text("status").notNull().default('negotiation'), // negotiation, escrow_pending, escrow_confirmed, in_transit, delivered
  escrowTxHash: text("escrow_tx_hash"),
  escrowConfirmations: integer("escrow_confirmations").default(0),
  messages: jsonb("messages").default(sql`'[]'::jsonb`), // chat messages
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// IoT Devices table
export const iotDevices = pgTable("iot_devices", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // moisture_sensor, weight_sensor, temp_sensor
  listingId: varchar("listing_id"),
  currentReading: jsonb("current_reading"), // { moisture, temp, weight_kg }
  lastUpdate: timestamp("last_update").defaultNow(),
});

// Price History table
export const priceHistory = pgTable("price_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  product: text("product").notNull(),
  date: timestamp("date").notNull(),
  avgPrice: integer("avg_price").notNull(),
  high: integer("high").notNull(),
  low: integer("low").notNull(),
  volume: integer("volume").notNull(),
});

// Export Matches table
export const exportMatches = pgTable("export_matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  product: text("product").notNull(),
  country: text("country").notNull(),
  port: text("port").notNull(),
  demandTons: integer("demand_tons").notNull(),
  readinessScore: integer("readiness_score").notNull(),
  contactEmail: text("contact_email"),
  notes: text("notes"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertListingSchema = createInsertSchema(listings).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIotDeviceSchema = createInsertSchema(iotDevices).omit({
  lastUpdate: true,
});

export const insertPriceHistorySchema = createInsertSchema(priceHistory).omit({
  id: true,
});

export const insertExportMatchSchema = createInsertSchema(exportMatches).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Listing = typeof listings.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type IotDevice = typeof iotDevices.$inferSelect;
export type InsertIotDevice = z.infer<typeof insertIotDeviceSchema>;

export type PriceHistory = typeof priceHistory.$inferSelect;
export type InsertPriceHistory = z.infer<typeof insertPriceHistorySchema>;

export type ExportMatch = typeof exportMatches.$inferSelect;
export type InsertExportMatch = z.infer<typeof insertExportMatchSchema>;

// Additional types for API responses
export type ListingWithSeller = Listing & {
  seller: {
    id: string;
    name: string;
    role: string;
    rating: number;
  };
};

export type OrderWithDetails = Order & {
  listing: Listing;
  buyer: User;
  seller: User;
};

export type IoTReading = {
  moisture?: number;
  temp?: number;
  weight_kg?: number;
  timestamp: string;
};

export type WebSocketMessage =
  | { type: 'price_update'; product: string; price_per_ton: number; timestamp: string }
  | { type: 'new_listing'; listing: ListingWithSeller }
  | { type: 'iot_update'; device_id: string; moisture?: number; temp?: number; weight_kg?: number };
