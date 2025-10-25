var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    MemStorage = class {
      users;
      listings;
      orders;
      iotDevices;
      priceHistory;
      exportMatches;
      constructor() {
        this.users = /* @__PURE__ */ new Map();
        this.listings = /* @__PURE__ */ new Map();
        this.orders = /* @__PURE__ */ new Map();
        this.iotDevices = /* @__PURE__ */ new Map();
        this.priceHistory = /* @__PURE__ */ new Map();
        this.exportMatches = /* @__PURE__ */ new Map();
      }
      // Users
      async getUser(id) {
        return this.users.get(id);
      }
      async getUserByEmail(email) {
        return Array.from(this.users.values()).find((user) => user.email === email);
      }
      async createUser(insertUser) {
        const id = randomUUID();
        const user = { ...insertUser, id, rating: insertUser.rating || 0, createdAt: /* @__PURE__ */ new Date() };
        this.users.set(id, user);
        return user;
      }
      async listUsers() {
        return Array.from(this.users.values());
      }
      // Listings
      async getListing(id) {
        return this.listings.get(id);
      }
      async getListingWithSeller(id) {
        const listing = this.listings.get(id);
        if (!listing) return void 0;
        const seller = this.users.get(listing.sellerId);
        if (!seller) return void 0;
        return {
          ...listing,
          seller: {
            id: seller.id,
            name: seller.name,
            role: seller.role,
            rating: seller.rating || 0
          }
        };
      }
      async listListings(filters) {
        let listings = Array.from(this.listings.values());
        if (filters?.query) {
          const query = filters.query.toLowerCase();
          listings = listings.filter(
            (l) => l.title.toLowerCase().includes(query) || l.grade.toLowerCase().includes(query) || l.type.toLowerCase().includes(query)
          );
        }
        if (filters?.type && filters.type !== "all") {
          listings = listings.filter((l) => l.type === filters.type);
        }
        const offset = filters?.offset || 0;
        const limit = filters?.limit || 50;
        listings = listings.slice(offset, offset + limit);
        const listingsWithSeller = await Promise.all(
          listings.map(async (listing) => {
            const seller = this.users.get(listing.sellerId);
            return {
              ...listing,
              seller: seller ? { id: seller.id, name: seller.name, role: seller.role, rating: seller.rating || 0 } : { id: "", name: "Unknown", role: "unknown", rating: 0 }
            };
          })
        );
        return listingsWithSeller;
      }
      async createListing(insertListing) {
        const id = `LST-${String(this.listings.size + 1).padStart(4, "0")}`;
        const listing = {
          ...insertListing,
          id,
          status: insertListing.status || "available",
          createdAt: /* @__PURE__ */ new Date()
        };
        this.listings.set(id, listing);
        return listing;
      }
      async updateListing(id, update) {
        const listing = this.listings.get(id);
        if (!listing) return void 0;
        const updated = { ...listing, ...update };
        this.listings.set(id, updated);
        return updated;
      }
      async deleteListing(id) {
        return this.listings.delete(id);
      }
      // Orders
      async getOrder(id) {
        return this.orders.get(id);
      }
      async listOrders(userId) {
        let orders = Array.from(this.orders.values());
        if (userId) {
          orders = orders.filter((o) => o.buyerId === userId || o.sellerId === userId);
        }
        return orders;
      }
      async createOrder(insertOrder) {
        const id = `ORD-${String(this.orders.size + 1).padStart(4, "0")}`;
        const order = {
          ...insertOrder,
          id,
          status: insertOrder.status || "negotiation",
          escrowConfirmations: insertOrder.escrowConfirmations || 0,
          messages: insertOrder.messages || [],
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        };
        this.orders.set(id, order);
        return order;
      }
      async updateOrder(id, update) {
        const order = this.orders.get(id);
        if (!order) return void 0;
        const updated = { ...order, ...update, updatedAt: /* @__PURE__ */ new Date() };
        this.orders.set(id, updated);
        return updated;
      }
      // IoT Devices
      async getIotDevice(id) {
        return this.iotDevices.get(id);
      }
      async listIotDevices() {
        return Array.from(this.iotDevices.values());
      }
      async createIotDevice(insertDevice) {
        const device = {
          ...insertDevice,
          lastUpdate: /* @__PURE__ */ new Date()
        };
        this.iotDevices.set(device.id, device);
        return device;
      }
      async updateIotDevice(id, update) {
        const device = this.iotDevices.get(id);
        if (!device) return void 0;
        const updated = { ...device, ...update, lastUpdate: /* @__PURE__ */ new Date() };
        this.iotDevices.set(id, updated);
        return updated;
      }
      // Price History
      async getPriceHistory(product, range) {
        const histories = Array.from(this.priceHistory.values()).filter((h) => h.product === product);
        const days = range.endsWith("d") ? parseInt(range) : 30;
        const cutoffDate = /* @__PURE__ */ new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return histories.filter((h) => new Date(h.date) >= cutoffDate).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }
      async createPriceHistory(insertHistory) {
        const id = randomUUID();
        const history = { ...insertHistory, id };
        this.priceHistory.set(id, history);
        return history;
      }
      // Export Matches
      async listExportMatches(product) {
        let matches = Array.from(this.exportMatches.values());
        if (product) {
          matches = matches.filter((m) => m.product === product);
        }
        return matches;
      }
      async createExportMatch(insertMatch) {
        const id = randomUUID();
        const match = { ...insertMatch, id };
        this.exportMatches.set(id, match);
        return match;
      }
    };
    storage = new MemStorage();
  }
});

// server/seed.ts
var seed_exports = {};
__export(seed_exports, {
  seedDatabase: () => seedDatabase
});
async function seedDatabase() {
  console.log("Seeding database...");
  const users = [
    {
      email: "ramesh.kumar@farmer.in",
      name: "Ramesh Kumar",
      role: "farmer",
      rating: 4.6,
      phone: "+91 98765 43210",
      location: "Varanasi, Uttar Pradesh"
    },
    {
      email: "hind.agro@processor.in",
      name: "Hind Agro Pvt Ltd",
      role: "processor",
      rating: 4.8,
      phone: "+91 95432 10987",
      location: "Indore, Madhya Pradesh"
    },
    {
      email: "dairypro@buyer.in",
      name: "DairyPro Foods",
      role: "buyer",
      rating: 4.5,
      phone: "+91 98123 45678",
      location: "Pune, Maharashtra"
    },
    {
      email: "globalfeeds@export.eg",
      name: "GlobalFeeds Ltd",
      role: "buyer",
      rating: 4.9,
      phone: "+20 123 456 789",
      location: "Cairo, Egypt"
    },
    {
      email: "sunita.singh@farmer.in",
      name: "Sunita Singh",
      role: "farmer",
      rating: 4.4,
      phone: "+91 91234 56789",
      location: "Jaipur, Rajasthan"
    }
  ];
  const createdUsers = await Promise.all(users.map((u) => storage.createUser(u)));
  console.log(`Created ${createdUsers.length} users`);
  const listingTemplates = [
    { type: "soymeal", grade: "48% Protein", basePrice: 42e3, moisture: 9.2, ash: 6.5, oil: 1.5 },
    { type: "soymeal", grade: "44% Protein", basePrice: 39e3, moisture: 9.5, ash: 6.8, oil: 1.8 },
    { type: "sunflower_cake", grade: "Industrial Grade", basePrice: 38500, moisture: 8.5, ash: 7.2, oil: 2 },
    { type: "sunflower_cake", grade: "Feed Grade", basePrice: 35e3, moisture: 9, ash: 7.5, oil: 2.5 },
    { type: "husk", grade: "Premium", basePrice: 12e3, moisture: 10, ash: 12, oil: 0.5 },
    { type: "husk", grade: "Standard", basePrice: 1e4, moisture: 11, ash: 13, oil: 0.8 },
    { type: "specialty", grade: "Organic Certified", basePrice: 55e3, moisture: 7, ash: 5, oil: 3 },
    { type: "specialty", grade: "Cold Pressed", basePrice: 52e3, moisture: 7.5, ash: 5.5, oil: 3.5 }
  ];
  const locations = [
    { lat: 25.3176, lng: 82.9739, address: "Varanasi, Uttar Pradesh" },
    { lat: 22.7196, lng: 75.8577, address: "Indore, Madhya Pradesh" },
    { lat: 18.5204, lng: 73.8567, address: "Pune, Maharashtra" },
    { lat: 26.9124, lng: 75.7873, address: "Jaipur, Rajasthan" },
    { lat: 28.7041, lng: 77.1025, address: "Delhi, NCR" },
    { lat: 23.0225, lng: 72.5714, address: "Ahmedabad, Gujarat" },
    { lat: 21.1702, lng: 72.8311, address: "Surat, Gujarat" },
    { lat: 12.9716, lng: 77.5946, address: "Bangalore, Karnataka" }
  ];
  const listings = [];
  for (let i = 0; i < 32; i++) {
    const template = listingTemplates[i % listingTemplates.length];
    const location = locations[i % locations.length];
    const seller = createdUsers[i % (createdUsers.length - 1)];
    const priceVariation = (Math.random() - 0.5) * 0.1;
    const quantityBase = [8e3, 1e4, 12e3, 15e3, 18e3, 2e4];
    listings.push({
      title: `${template.type.charAt(0).toUpperCase() + template.type.slice(1).replace("_", " ")} (${template.grade}) - ${i % 2 === 0 ? "Bulk" : "Premium"}`,
      type: template.type,
      grade: template.grade,
      quantityKg: quantityBase[i % quantityBase.length] + Math.floor(Math.random() * 3e3),
      pricePerTon: Math.round(template.basePrice * (1 + priceVariation)),
      location,
      sellerId: seller.id,
      quality: {
        moisture_pct: template.moisture + (Math.random() - 0.5) * 0.5,
        ash_pct: template.ash + (Math.random() - 0.5) * 0.3,
        oil_pct: template.oil + (Math.random() - 0.5) * 0.2
      },
      iotDeviceId: i % 3 === 0 ? `SENSOR-${String(Math.floor(i / 3) + 8891).padStart(4, "0")}` : null,
      images: [],
      status: i % 10 === 0 ? "pending" : "available"
    });
  }
  const createdListings = await Promise.all(listings.map((l) => storage.createListing(l)));
  console.log(`Created ${createdListings.length} listings`);
  const iotDevices = [
    {
      id: "SENSOR-8891",
      name: "Moisture Sensor Alpha",
      type: "moisture_sensor",
      listingId: createdListings[0]?.id,
      currentReading: { moisture: 9.2, temp: 28.5, weight_kg: 12e3 }
    },
    {
      id: "SENSOR-8892",
      name: "Temperature Monitor Beta",
      type: "temp_sensor",
      listingId: createdListings[3]?.id,
      currentReading: { moisture: 8.8, temp: 27.2, weight_kg: 15e3 }
    },
    {
      id: "SENSOR-8893",
      name: "Weight Scale Gamma",
      type: "weight_sensor",
      listingId: createdListings[6]?.id,
      currentReading: { moisture: 9.5, temp: 29.1, weight_kg: 18e3 }
    },
    {
      id: "SENSOR-8894",
      name: "Multi-Sensor Delta",
      type: "moisture_sensor",
      listingId: createdListings[9]?.id,
      currentReading: { moisture: 8.3, temp: 26.8, weight_kg: 1e4 }
    },
    {
      id: "SENSOR-8895",
      name: "Smart Monitor Epsilon",
      type: "temp_sensor",
      listingId: createdListings[12]?.id,
      currentReading: { moisture: 9.7, temp: 30.2, weight_kg: 14500 }
    }
  ];
  const createdDevices = await Promise.all(iotDevices.map((d) => storage.createIotDevice(d)));
  console.log(`Created ${createdDevices.length} IoT devices`);
  const orders = [
    {
      listingId: createdListings[0].id,
      buyerId: createdUsers[2].id,
      sellerId: createdListings[0].sellerId,
      quantityKg: 5e3,
      agreedPrice: 21e4,
      status: "negotiation",
      messages: [
        { sender: "buyer", text: "Interested in 5 tons. Can you offer a discount?", timestamp: (/* @__PURE__ */ new Date()).toISOString() },
        { sender: "seller", text: "We can do \u20B942,000 per ton for 5 tons.", timestamp: (/* @__PURE__ */ new Date()).toISOString() }
      ]
    },
    {
      listingId: createdListings[3].id,
      buyerId: createdUsers[3].id,
      sellerId: createdListings[3].sellerId,
      quantityKg: 1e4,
      agreedPrice: 38e4,
      status: "escrow_confirmed",
      escrowTxHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      escrowConfirmations: 3
    },
    {
      listingId: createdListings[6].id,
      buyerId: createdUsers[2].id,
      sellerId: createdListings[6].sellerId,
      quantityKg: 8e3,
      agreedPrice: 96e3,
      status: "delivered",
      escrowTxHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      escrowConfirmations: 3
    }
  ];
  const createdOrders = await Promise.all(orders.map((o) => storage.createOrder(o)));
  console.log(`Created ${createdOrders.length} orders`);
  const products = ["soymeal", "sunflower_cake", "husk", "specialty"];
  const basePrices = { soymeal: 42e3, sunflower_cake: 38500, husk: 12e3, specialty: 55e3 };
  for (const product of products) {
    const basePrice = basePrices[product];
    for (let i = 0; i < 90; i++) {
      const date = /* @__PURE__ */ new Date();
      date.setDate(date.getDate() - (90 - i));
      const trend = Math.sin(i / 15) * 0.1;
      const noise = (Math.random() - 0.5) * 0.05;
      const price = Math.round(basePrice * (1 + trend + noise));
      const volatility = Math.round(price * 0.05);
      const priceHistory = {
        product,
        date,
        avgPrice: price,
        high: price + volatility,
        low: price - volatility,
        volume: Math.round(1e4 + Math.random() * 5e3)
      };
      await storage.createPriceHistory(priceHistory);
    }
  }
  console.log(`Created price history for ${products.length} products (90 days each)`);
  const exportMatches = [
    {
      product: "soymeal",
      country: "Egypt",
      port: "Alexandria",
      demandTons: 5e3,
      readinessScore: 92,
      contactEmail: "import@egyptfeeds.eg",
      notes: "Requires 48% protein minimum, regular shipments preferred"
    },
    {
      product: "sunflower_cake",
      country: "UAE",
      port: "Dubai",
      demandTons: 3e3,
      readinessScore: 88,
      contactEmail: "procurement@uaeagro.ae",
      notes: "Looking for consistent quality, monthly orders"
    },
    {
      product: "specialty",
      country: "Germany",
      port: "Hamburg",
      demandTons: 2e3,
      readinessScore: 95,
      contactEmail: "sourcing@germanorganics.de",
      notes: "Organic certification required, premium pricing available"
    }
  ];
  const createdMatches = await Promise.all(exportMatches.map((m) => storage.createExportMatch(m)));
  console.log(`Created ${createdMatches.length} export matches`);
  console.log("Database seeding completed!");
  console.log(`Total: ${createdUsers.length} users, ${createdListings.length} listings, ${createdOrders.length} orders, ${createdDevices.length} devices`);
}
var init_seed = __esm({
  "server/seed.ts"() {
    "use strict";
    init_storage();
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
init_storage();
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
async function registerRoutes(app2) {
  const httpServer = createServer(app2);
  app2.get("/api/listings", async (req, res) => {
    try {
      const { query, type, limit, offset } = req.query;
      const listings = await storage.listListings({
        query,
        type,
        limit: limit ? parseInt(limit) : void 0,
        offset: offset ? parseInt(offset) : void 0
      });
      res.json(listings);
    } catch (error) {
      console.error("Error fetching listings:", error);
      res.status(500).json({ error: "Failed to fetch listings" });
    }
  });
  app2.get("/api/listings/:id", async (req, res) => {
    try {
      const listing = await storage.getListingWithSeller(req.params.id);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      res.json(listing);
    } catch (error) {
      console.error("Error fetching listing:", error);
      res.status(500).json({ error: "Failed to fetch listing" });
    }
  });
  app2.post("/api/listings", async (req, res) => {
    try {
      const listing = await storage.createListing(req.body);
      const listingWithSeller = await storage.getListingWithSeller(listing.id);
      if (listingWithSeller) {
        broadcast({ type: "new_listing", listing: listingWithSeller });
      }
      res.status(201).json(listing);
    } catch (error) {
      console.error("Error creating listing:", error);
      res.status(500).json({ error: "Failed to create listing" });
    }
  });
  app2.put("/api/listings/:id", async (req, res) => {
    try {
      const listing = await storage.updateListing(req.params.id, req.body);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      res.json(listing);
    } catch (error) {
      console.error("Error updating listing:", error);
      res.status(500).json({ error: "Failed to update listing" });
    }
  });
  app2.delete("/api/listings/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteListing(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Listing not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting listing:", error);
      res.status(500).json({ error: "Failed to delete listing" });
    }
  });
  app2.get("/api/orders", async (req, res) => {
    try {
      const { userId } = req.query;
      const orders = await storage.listOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });
  app2.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });
  app2.post("/api/orders", async (req, res) => {
    try {
      const order = await storage.createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });
  app2.put("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.updateOrder(req.params.id, req.body);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ error: "Failed to update order" });
    }
  });
  app2.get("/api/iot/devices", async (req, res) => {
    try {
      const devices = await storage.listIotDevices();
      res.json(devices);
    } catch (error) {
      console.error("Error fetching devices:", error);
      res.status(500).json({ error: "Failed to fetch IoT devices" });
    }
  });
  app2.get("/api/iot/devices/:id", async (req, res) => {
    try {
      const device = await storage.getIotDevice(req.params.id);
      if (!device) {
        return res.status(404).json({ error: "Device not found" });
      }
      res.json(device);
    } catch (error) {
      console.error("Error fetching device:", error);
      res.status(500).json({ error: "Failed to fetch device" });
    }
  });
  app2.post("/api/iot/devices", async (req, res) => {
    try {
      const device = await storage.createIotDevice(req.body);
      res.status(201).json(device);
    } catch (error) {
      console.error("Error creating device:", error);
      res.status(500).json({ error: "Failed to create device" });
    }
  });
  app2.put("/api/iot/devices/:id", async (req, res) => {
    try {
      const device = await storage.updateIotDevice(req.params.id, req.body);
      if (!device) {
        return res.status(404).json({ error: "Device not found" });
      }
      if (device.currentReading) {
        const reading = typeof device.currentReading === "string" ? JSON.parse(device.currentReading) : device.currentReading;
        broadcast({
          type: "iot_update",
          device_id: device.id,
          ...reading
        });
      }
      res.json(device);
    } catch (error) {
      console.error("Error updating device:", error);
      res.status(500).json({ error: "Failed to update device" });
    }
  });
  app2.get("/api/market/price-history", async (req, res) => {
    try {
      const { product = "soymeal", range = "30d" } = req.query;
      const history = await storage.getPriceHistory(product, range);
      res.json(history);
    } catch (error) {
      console.error("Error fetching price history:", error);
      res.status(500).json({ error: "Failed to fetch price history" });
    }
  });
  app2.get("/api/export-matches", async (req, res) => {
    try {
      const { product } = req.query;
      const matches = await storage.listExportMatches(product);
      res.json(matches);
    } catch (error) {
      console.error("Error fetching export matches:", error);
      res.status(500).json({ error: "Failed to fetch export matches" });
    }
  });
  app2.get("/api/users", async (req, res) => {
    try {
      const users = await storage.listUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });
  app2.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });
  app2.post("/api/users", async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  const clients = /* @__PURE__ */ new Set();
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
    clients.add(ws);
    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      clients.delete(ws);
    });
    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      clients.delete(ws);
    });
  });
  function broadcast(message) {
    const data = JSON.stringify(message);
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
  setInterval(() => {
    const products = ["soymeal", "sunflower_cake", "husk", "specialty"];
    const product = products[Math.floor(Math.random() * products.length)];
    const basePrice = product === "soymeal" ? 42e3 : product === "sunflower_cake" ? 38500 : product === "husk" ? 12e3 : 55e3;
    const price = basePrice + (Math.random() - 0.5) * 1e3;
    broadcast({
      type: "price_update",
      product,
      price_per_ton: Math.round(price),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }, 5e3);
  setInterval(async () => {
    const devices = await storage.listIotDevices();
    if (devices.length > 0) {
      const device = devices[Math.floor(Math.random() * devices.length)];
      const currentReading = typeof device.currentReading === "string" ? JSON.parse(device.currentReading) : device.currentReading || {};
      const newReading = {
        moisture: currentReading.moisture ? currentReading.moisture + (Math.random() - 0.5) * 0.3 : 9,
        temp: currentReading.temp ? currentReading.temp + (Math.random() - 0.5) * 0.8 : 28,
        weight_kg: currentReading.weight_kg ? currentReading.weight_kg + (Math.random() - 0.5) * 50 : 12e3
      };
      await storage.updateIotDevice(device.id, { currentReading: newReading });
      broadcast({
        type: "iot_update",
        device_id: device.id,
        ...newReading
      });
    }
  }, 4e3);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  base: process.env.VITE_BASE_PATH || "/agamsiingh/AgriChain2",
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "frontend", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "frontend"),
  build: {
    outDir: path.resolve(import.meta.dirname, "frontend", "dist"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const { seedDatabase: seedDatabase2 } = await Promise.resolve().then(() => (init_seed(), seed_exports));
  await seedDatabase2();
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "8000", 10);
  const baseListenOptions = {
    host: "127.0.0.1"
  };
  if (process.platform !== "win32") {
    baseListenOptions.reusePort = true;
  }
  async function tryListen(startPort, attempts = 10) {
    let lastErr = null;
    for (let i = 0; i < attempts; i++) {
      const tryPort = startPort + i;
      const opts = { ...baseListenOptions, port: tryPort };
      try {
        await new Promise((resolve, reject) => {
          const onError = (err) => {
            server.removeListener("listening", onListening);
            server.removeListener("error", onError);
            reject(err);
          };
          const onListening = () => {
            server.removeListener("error", onError);
            server.removeListener("listening", onListening);
            resolve();
          };
          server.once("error", onError);
          server.once("listening", onListening);
          server.listen(opts);
        });
        return tryPort;
      } catch (err) {
        lastErr = err;
        if (err && err.code === "EADDRINUSE") {
          log(`port ${tryPort} is in use, trying next port...`);
        } else {
          throw err;
        }
      }
    }
    const message = lastErr ? `${lastErr.message} (code=${lastErr.code})` : "Failed to bind to port(s)";
    throw new Error(`Could not start server: ${message}`);
  }
  try {
    const boundPort = await tryListen(port, 10);
    log(`serving on port ${boundPort}`);
  } catch (e) {
    console.error("Failed to start server:", e);
    process.exit(1);
  }
})();
