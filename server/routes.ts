import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import type { InsertListing, InsertOrder, WebSocketMessage } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Listings endpoints
  app.get("/api/listings", async (req: Request, res: Response) => {
    try {
      const { query, type, limit, offset } = req.query;
      const listings = await storage.listListings({
        query: query as string,
        type: type as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.json(listings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      res.status(500).json({ error: "Failed to fetch listings" });
    }
  });

  app.get("/api/listings/:id", async (req: Request, res: Response) => {
    try {
      const listing = await storage.getListingWithSeller(req.params.id);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      res.json(listing);
    } catch (error) {
      console.error('Error fetching listing:', error);
      res.status(500).json({ error: "Failed to fetch listing" });
    }
  });

  app.post("/api/listings", async (req: Request, res: Response) => {
    try {
      const listing = await storage.createListing(req.body as InsertListing);
      
      // Broadcast new listing via WebSocket
      const listingWithSeller = await storage.getListingWithSeller(listing.id);
      if (listingWithSeller) {
        broadcast({ type: 'new_listing', listing: listingWithSeller });
      }

      res.status(201).json(listing);
    } catch (error) {
      console.error('Error creating listing:', error);
      res.status(500).json({ error: "Failed to create listing" });
    }
  });

  app.put("/api/listings/:id", async (req: Request, res: Response) => {
    try {
      const listing = await storage.updateListing(req.params.id, req.body);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      res.json(listing);
    } catch (error) {
      console.error('Error updating listing:', error);
      res.status(500).json({ error: "Failed to update listing" });
    }
  });

  app.delete("/api/listings/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteListing(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Listing not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting listing:', error);
      res.status(500).json({ error: "Failed to delete listing" });
    }
  });

  // Orders endpoints
  app.get("/api/orders", async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      const orders = await storage.listOrders(userId as string);
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const order = await storage.createOrder(req.body as InsertOrder);
      res.status(201).json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.put("/api/orders/:id", async (req: Request, res: Response) => {
    try {
      const order = await storage.updateOrder(req.params.id, req.body);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  // IoT Devices endpoints
  app.get("/api/iot/devices", async (req: Request, res: Response) => {
    try {
      const devices = await storage.listIotDevices();
      res.json(devices);
    } catch (error) {
      console.error('Error fetching devices:', error);
      res.status(500).json({ error: "Failed to fetch IoT devices" });
    }
  });

  app.get("/api/iot/devices/:id", async (req: Request, res: Response) => {
    try {
      const device = await storage.getIotDevice(req.params.id);
      if (!device) {
        return res.status(404).json({ error: "Device not found" });
      }
      res.json(device);
    } catch (error) {
      console.error('Error fetching device:', error);
      res.status(500).json({ error: "Failed to fetch device" });
    }
  });

  app.post("/api/iot/devices", async (req: Request, res: Response) => {
    try {
      const device = await storage.createIotDevice(req.body);
      res.status(201).json(device);
    } catch (error) {
      console.error('Error creating device:', error);
      res.status(500).json({ error: "Failed to create device" });
    }
  });

  app.put("/api/iot/devices/:id", async (req: Request, res: Response) => {
    try {
      const device = await storage.updateIotDevice(req.params.id, req.body);
      if (!device) {
        return res.status(404).json({ error: "Device not found" });
      }

      // Broadcast IoT update via WebSocket
      if (device.currentReading) {
        const reading = typeof device.currentReading === 'string'
          ? JSON.parse(device.currentReading)
          : device.currentReading;
        broadcast({
          type: 'iot_update',
          device_id: device.id,
          ...reading,
        });
      }

      res.json(device);
    } catch (error) {
      console.error('Error updating device:', error);
      res.status(500).json({ error: "Failed to update device" });
    }
  });

  // Market Data endpoints
  app.get("/api/market/price-history", async (req: Request, res: Response) => {
    try {
      const { product = 'soymeal', range = '30d' } = req.query;
      const history = await storage.getPriceHistory(product as string, range as string);
      res.json(history);
    } catch (error) {
      console.error('Error fetching price history:', error);
      res.status(500).json({ error: "Failed to fetch price history" });
    }
  });

  app.get("/api/export-matches", async (req: Request, res: Response) => {
    try {
      const { product } = req.query;
      const matches = await storage.listExportMatches(product as string);
      res.json(matches);
    } catch (error) {
      console.error('Error fetching export matches:', error);
      res.status(500).json({ error: "Failed to fetch export matches" });
    }
  });

  // Users endpoints
  app.get("/api/users", async (req: Request, res: Response) => {
    try {
      const users = await storage.listUsers();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const user = await storage.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');
    clients.add(ws);

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      clients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  // Broadcast function for WebSocket messages
  function broadcast(message: WebSocketMessage) {
    const data = JSON.stringify(message);
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  // Simulate real-time price updates
  setInterval(() => {
    const products = ['soymeal', 'sunflower_cake', 'husk', 'specialty'];
    const product = products[Math.floor(Math.random() * products.length)];
    const basePrice = product === 'soymeal' ? 42000 : product === 'sunflower_cake' ? 38500 : product === 'husk' ? 12000 : 55000;
    const price = basePrice + (Math.random() - 0.5) * 1000;

    broadcast({
      type: 'price_update',
      product,
      price_per_ton: Math.round(price),
      timestamp: new Date().toISOString(),
    });
  }, 5000);

  // Simulate IoT updates
  setInterval(async () => {
    const devices = await storage.listIotDevices();
    if (devices.length > 0) {
      const device = devices[Math.floor(Math.random() * devices.length)];
      const currentReading = typeof device.currentReading === 'string'
        ? JSON.parse(device.currentReading)
        : device.currentReading || {};

      const newReading = {
        moisture: currentReading.moisture ? currentReading.moisture + (Math.random() - 0.5) * 0.3 : 9.0,
        temp: currentReading.temp ? currentReading.temp + (Math.random() - 0.5) * 0.8 : 28.0,
        weight_kg: currentReading.weight_kg ? currentReading.weight_kg + (Math.random() - 0.5) * 50 : 12000,
      };

      await storage.updateIotDevice(device.id, { currentReading: newReading });

      broadcast({
        type: 'iot_update',
        device_id: device.id,
        ...newReading,
      });
    }
  }, 4000);

  return httpServer;
}
