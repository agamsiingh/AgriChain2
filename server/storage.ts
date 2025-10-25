import type {
  User, InsertUser,
  Listing, InsertListing, ListingWithSeller,
  Order, InsertOrder, OrderWithDetails,
  IotDevice, InsertIotDevice,
  PriceHistory, InsertPriceHistory,
  ExportMatch, InsertExportMatch,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  listUsers(): Promise<User[]>;

  // Listings
  getListing(id: string): Promise<Listing | undefined>;
  getListingWithSeller(id: string): Promise<ListingWithSeller | undefined>;
  listListings(filters?: { query?: string; type?: string; limit?: number; offset?: number }): Promise<ListingWithSeller[]>;
  createListing(listing: InsertListing): Promise<Listing>;
  updateListing(id: string, listing: Partial<Listing>): Promise<Listing | undefined>;
  deleteListing(id: string): Promise<boolean>;

  // Orders
  getOrder(id: string): Promise<Order | undefined>;
  listOrders(userId?: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<Order>): Promise<Order | undefined>;

  // IoT Devices
  getIotDevice(id: string): Promise<IotDevice | undefined>;
  listIotDevices(): Promise<IotDevice[]>;
  createIotDevice(device: InsertIotDevice): Promise<IotDevice>;
  updateIotDevice(id: string, device: Partial<IotDevice>): Promise<IotDevice | undefined>;

  // Price History
  getPriceHistory(product: string, range: string): Promise<PriceHistory[]>;
  createPriceHistory(history: InsertPriceHistory): Promise<PriceHistory>;

  // Export Matches
  listExportMatches(product?: string): Promise<ExportMatch[]>;
  createExportMatch(match: InsertExportMatch): Promise<ExportMatch>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private listings: Map<string, Listing>;
  private orders: Map<string, Order>;
  private iotDevices: Map<string, IotDevice>;
  private priceHistory: Map<string, PriceHistory>;
  private exportMatches: Map<string, ExportMatch>;

  constructor() {
    this.users = new Map();
    this.listings = new Map();
    this.orders = new Map();
    this.iotDevices = new Map();
    this.priceHistory = new Map();
    this.exportMatches = new Map();
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, rating: insertUser.rating || 0, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async listUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Listings
  async getListing(id: string): Promise<Listing | undefined> {
    return this.listings.get(id);
  }

  async getListingWithSeller(id: string): Promise<ListingWithSeller | undefined> {
    const listing = this.listings.get(id);
    if (!listing) return undefined;

    const seller = this.users.get(listing.sellerId);
    if (!seller) return undefined;

    return {
      ...listing,
      seller: {
        id: seller.id,
        name: seller.name,
        role: seller.role,
        rating: seller.rating || 0,
      },
    };
  }

  async listListings(filters?: { query?: string; type?: string; limit?: number; offset?: number }): Promise<ListingWithSeller[]> {
    let listings = Array.from(this.listings.values());

    if (filters?.query) {
      const query = filters.query.toLowerCase();
      listings = listings.filter(
        (l) =>
          l.title.toLowerCase().includes(query) ||
          l.grade.toLowerCase().includes(query) ||
          l.type.toLowerCase().includes(query)
      );
    }

    if (filters?.type && filters.type !== 'all') {
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
          seller: seller
            ? { id: seller.id, name: seller.name, role: seller.role, rating: seller.rating || 0 }
            : { id: '', name: 'Unknown', role: 'unknown', rating: 0 },
        };
      })
    );

    return listingsWithSeller;
  }

  async createListing(insertListing: InsertListing): Promise<Listing> {
    const id = `LST-${String(this.listings.size + 1).padStart(4, '0')}`;
    const listing: Listing = {
      ...insertListing,
      id,
      status: insertListing.status || 'available',
      createdAt: new Date(),
    };
    this.listings.set(id, listing);
    return listing;
  }

  async updateListing(id: string, update: Partial<Listing>): Promise<Listing | undefined> {
    const listing = this.listings.get(id);
    if (!listing) return undefined;

    const updated = { ...listing, ...update };
    this.listings.set(id, updated);
    return updated;
  }

  async deleteListing(id: string): Promise<boolean> {
    return this.listings.delete(id);
  }

  // Orders
  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async listOrders(userId?: string): Promise<Order[]> {
    let orders = Array.from(this.orders.values());
    if (userId) {
      orders = orders.filter((o) => o.buyerId === userId || o.sellerId === userId);
    }
    return orders;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = `ORD-${String(this.orders.size + 1).padStart(4, '0')}`;
    const order: Order = {
      ...insertOrder,
      id,
      status: insertOrder.status || 'negotiation',
      escrowConfirmations: insertOrder.escrowConfirmations || 0,
      messages: insertOrder.messages || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: string, update: Partial<Order>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updated = { ...order, ...update, updatedAt: new Date() };
    this.orders.set(id, updated);
    return updated;
  }

  // IoT Devices
  async getIotDevice(id: string): Promise<IotDevice | undefined> {
    return this.iotDevices.get(id);
  }

  async listIotDevices(): Promise<IotDevice[]> {
    return Array.from(this.iotDevices.values());
  }

  async createIotDevice(insertDevice: InsertIotDevice): Promise<IotDevice> {
    const device: IotDevice = {
      ...insertDevice,
      lastUpdate: new Date(),
    };
    this.iotDevices.set(device.id, device);
    return device;
  }

  async updateIotDevice(id: string, update: Partial<IotDevice>): Promise<IotDevice | undefined> {
    const device = this.iotDevices.get(id);
    if (!device) return undefined;

    const updated = { ...device, ...update, lastUpdate: new Date() };
    this.iotDevices.set(id, updated);
    return updated;
  }

  // Price History
  async getPriceHistory(product: string, range: string): Promise<PriceHistory[]> {
    const histories = Array.from(this.priceHistory.values()).filter((h) => h.product === product);

    const days = range.endsWith('d') ? parseInt(range) : 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return histories
      .filter((h) => new Date(h.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async createPriceHistory(insertHistory: InsertPriceHistory): Promise<PriceHistory> {
    const id = randomUUID();
    const history: PriceHistory = { ...insertHistory, id };
    this.priceHistory.set(id, history);
    return history;
  }

  // Export Matches
  async listExportMatches(product?: string): Promise<ExportMatch[]> {
    let matches = Array.from(this.exportMatches.values());
    if (product) {
      matches = matches.filter((m) => m.product === product);
    }
    return matches;
  }

  async createExportMatch(insertMatch: InsertExportMatch): Promise<ExportMatch> {
    const id = randomUUID();
    const match: ExportMatch = { ...insertMatch, id };
    this.exportMatches.set(id, match);
    return match;
  }
}

export const storage = new MemStorage();
