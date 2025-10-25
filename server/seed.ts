import { storage } from "./storage";
import type { InsertUser, InsertListing, InsertOrder, InsertIotDevice, InsertPriceHistory, InsertExportMatch } from "@shared/schema";

export async function seedDatabase() {
  console.log('Seeding database...');

  // Create users
  const users: InsertUser[] = [
    {
      email: 'ramesh.kumar@farmer.in',
      name: 'Ramesh Kumar',
      role: 'farmer',
      rating: 4.6,
      phone: '+91 98765 43210',
      location: 'Varanasi, Uttar Pradesh',
    },
    {
      email: 'hind.agro@processor.in',
      name: 'Hind Agro Pvt Ltd',
      role: 'processor',
      rating: 4.8,
      phone: '+91 95432 10987',
      location: 'Indore, Madhya Pradesh',
    },
    {
      email: 'dairypro@buyer.in',
      name: 'DairyPro Foods',
      role: 'buyer',
      rating: 4.5,
      phone: '+91 98123 45678',
      location: 'Pune, Maharashtra',
    },
    {
      email: 'globalfeeds@export.eg',
      name: 'GlobalFeeds Ltd',
      role: 'buyer',
      rating: 4.9,
      phone: '+20 123 456 789',
      location: 'Cairo, Egypt',
    },
    {
      email: 'sunita.singh@farmer.in',
      name: 'Sunita Singh',
      role: 'farmer',
      rating: 4.4,
      phone: '+91 91234 56789',
      location: 'Jaipur, Rajasthan',
    },
  ];

  const createdUsers = await Promise.all(users.map(u => storage.createUser(u)));
  console.log(`Created ${createdUsers.length} users`);

  // Listings data
  const listingTemplates = [
    { type: 'soymeal', grade: '48% Protein', basePrice: 42000, moisture: 9.2, ash: 6.5, oil: 1.5 },
    { type: 'soymeal', grade: '44% Protein', basePrice: 39000, moisture: 9.5, ash: 6.8, oil: 1.8 },
    { type: 'sunflower_cake', grade: 'Industrial Grade', basePrice: 38500, moisture: 8.5, ash: 7.2, oil: 2.0 },
    { type: 'sunflower_cake', grade: 'Feed Grade', basePrice: 35000, moisture: 9.0, ash: 7.5, oil: 2.5 },
    { type: 'husk', grade: 'Premium', basePrice: 12000, moisture: 10.0, ash: 12.0, oil: 0.5 },
    { type: 'husk', grade: 'Standard', basePrice: 10000, moisture: 11.0, ash: 13.0, oil: 0.8 },
    { type: 'specialty', grade: 'Organic Certified', basePrice: 55000, moisture: 7.0, ash: 5.0, oil: 3.0 },
    { type: 'specialty', grade: 'Cold Pressed', basePrice: 52000, moisture: 7.5, ash: 5.5, oil: 3.5 },
  ];

  const locations = [
    { lat: 25.3176, lng: 82.9739, address: 'Varanasi, Uttar Pradesh' },
    { lat: 22.7196, lng: 75.8577, address: 'Indore, Madhya Pradesh' },
    { lat: 18.5204, lng: 73.8567, address: 'Pune, Maharashtra' },
    { lat: 26.9124, lng: 75.7873, address: 'Jaipur, Rajasthan' },
    { lat: 28.7041, lng: 77.1025, address: 'Delhi, NCR' },
    { lat: 23.0225, lng: 72.5714, address: 'Ahmedabad, Gujarat' },
    { lat: 21.1702, lng: 72.8311, address: 'Surat, Gujarat' },
    { lat: 12.9716, lng: 77.5946, address: 'Bangalore, Karnataka' },
  ];

  const listings: InsertListing[] = [];

  for (let i = 0; i < 32; i++) {
    const template = listingTemplates[i % listingTemplates.length];
    const location = locations[i % locations.length];
    const seller = createdUsers[i % (createdUsers.length - 1)]; // Exclude last user (export buyer)

    const priceVariation = (Math.random() - 0.5) * 0.1;
    const quantityBase = [8000, 10000, 12000, 15000, 18000, 20000];

    listings.push({
      title: `${template.type.charAt(0).toUpperCase() + template.type.slice(1).replace('_', ' ')} (${template.grade}) - ${i % 2 === 0 ? 'Bulk' : 'Premium'}`,
      type: template.type,
      grade: template.grade,
      quantityKg: quantityBase[i % quantityBase.length] + Math.floor(Math.random() * 3000),
      pricePerTon: Math.round(template.basePrice * (1 + priceVariation)),
      location: location,
      sellerId: seller.id,
      quality: {
        moisture_pct: template.moisture + (Math.random() - 0.5) * 0.5,
        ash_pct: template.ash + (Math.random() - 0.5) * 0.3,
        oil_pct: template.oil + (Math.random() - 0.5) * 0.2,
      },
      iotDeviceId: i % 3 === 0 ? `SENSOR-${String(Math.floor(i / 3) + 8891).padStart(4, '0')}` : null,
      images: [],
      status: i % 10 === 0 ? 'pending' : 'available',
    });
  }

  const createdListings = await Promise.all(listings.map(l => storage.createListing(l)));
  console.log(`Created ${createdListings.length} listings`);

  // Create IoT devices
  const iotDevices: InsertIotDevice[] = [
    {
      id: 'SENSOR-8891',
      name: 'Moisture Sensor Alpha',
      type: 'moisture_sensor',
      listingId: createdListings[0]?.id,
      currentReading: { moisture: 9.2, temp: 28.5, weight_kg: 12000 },
    },
    {
      id: 'SENSOR-8892',
      name: 'Temperature Monitor Beta',
      type: 'temp_sensor',
      listingId: createdListings[3]?.id,
      currentReading: { moisture: 8.8, temp: 27.2, weight_kg: 15000 },
    },
    {
      id: 'SENSOR-8893',
      name: 'Weight Scale Gamma',
      type: 'weight_sensor',
      listingId: createdListings[6]?.id,
      currentReading: { moisture: 9.5, temp: 29.1, weight_kg: 18000 },
    },
    {
      id: 'SENSOR-8894',
      name: 'Multi-Sensor Delta',
      type: 'moisture_sensor',
      listingId: createdListings[9]?.id,
      currentReading: { moisture: 8.3, temp: 26.8, weight_kg: 10000 },
    },
    {
      id: 'SENSOR-8895',
      name: 'Smart Monitor Epsilon',
      type: 'temp_sensor',
      listingId: createdListings[12]?.id,
      currentReading: { moisture: 9.7, temp: 30.2, weight_kg: 14500 },
    },
  ];

  const createdDevices = await Promise.all(iotDevices.map(d => storage.createIotDevice(d)));
  console.log(`Created ${createdDevices.length} IoT devices`);

  // Create orders
  const orders: InsertOrder[] = [
    {
      listingId: createdListings[0].id,
      buyerId: createdUsers[2].id,
      sellerId: createdListings[0].sellerId,
      quantityKg: 5000,
      agreedPrice: 210000,
      status: 'negotiation',
      messages: [
        { sender: 'buyer', text: 'Interested in 5 tons. Can you offer a discount?', timestamp: new Date().toISOString() },
        { sender: 'seller', text: 'We can do ₹42,000 per ton for 5 tons.', timestamp: new Date().toISOString() },
      ],
    },
    {
      listingId: createdListings[3].id,
      buyerId: createdUsers[3].id,
      sellerId: createdListings[3].sellerId,
      quantityKg: 10000,
      agreedPrice: 380000,
      status: 'escrow_confirmed',
      escrowTxHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      escrowConfirmations: 3,
    },
    {
      listingId: createdListings[6].id,
      buyerId: createdUsers[2].id,
      sellerId: createdListings[6].sellerId,
      quantityKg: 8000,
      agreedPrice: 96000,
      status: 'delivered',
      escrowTxHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      escrowConfirmations: 3,
    },
  ];

  const createdOrders = await Promise.all(orders.map(o => storage.createOrder(o)));
  console.log(`Created ${createdOrders.length} orders`);

  // Create price history (90 days for multiple products)
  const products = ['soymeal', 'sunflower_cake', 'husk', 'specialty'];
  const basePrices = { soymeal: 42000, sunflower_cake: 38500, husk: 12000, specialty: 55000 };

  for (const product of products) {
    const basePrice = basePrices[product as keyof typeof basePrices];
    
    for (let i = 0; i < 90; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (90 - i));

      const trend = Math.sin(i / 15) * 0.1;
      const noise = (Math.random() - 0.5) * 0.05;
      const price = Math.round(basePrice * (1 + trend + noise));
      const volatility = Math.round(price * 0.05);

      const priceHistory: InsertPriceHistory = {
        product,
        date,
        avgPrice: price,
        high: price + volatility,
        low: price - volatility,
        volume: Math.round(10000 + Math.random() * 5000),
      };

      await storage.createPriceHistory(priceHistory);
    }
  }
  console.log(`Created price history for ${products.length} products (90 days each)`);

  // Create export matches
  const exportMatches: InsertExportMatch[] = [
    {
      product: 'soymeal',
      country: 'Egypt',
      port: 'Alexandria',
      demandTons: 5000,
      readinessScore: 92,
      contactEmail: 'import@egyptfeeds.eg',
      notes: 'Requires 48% protein minimum, regular shipments preferred',
    },
    {
      product: 'sunflower_cake',
      country: 'UAE',
      port: 'Dubai',
      demandTons: 3000,
      readinessScore: 88,
      contactEmail: 'procurement@uaeagro.ae',
      notes: 'Looking for consistent quality, monthly orders',
    },
    {
      product: 'specialty',
      country: 'Germany',
      port: 'Hamburg',
      demandTons: 2000,
      readinessScore: 95,
      contactEmail: 'sourcing@germanorganics.de',
      notes: 'Organic certification required, premium pricing available',
    },
  ];

  const createdMatches = await Promise.all(exportMatches.map(m => storage.createExportMatch(m)));
  console.log(`Created ${createdMatches.length} export matches`);

  console.log('Database seeding completed!');
  console.log(`Total: ${createdUsers.length} users, ${createdListings.length} listings, ${createdOrders.length} orders, ${createdDevices.length} devices`);
}
