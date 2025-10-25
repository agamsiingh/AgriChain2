export type Locale = 'en' | 'hi';

export const translations = {
  en: {
    // Landing page
    hero: {
      title: 'Monetize every seed',
      subtitle: 'connect, trade, forecast.',
      description: 'The complete value chain platform connecting farmers, processors and buyers for oilseed by-products.',
      joinFarmer: 'Join as Farmer',
      joinProcessor: 'Join as Processor',
      joinBuyer: 'Join as Buyer',
    },
    // Navigation
    nav: {
      marketplace: 'Marketplace',
      dashboard: 'Dashboard',
      orders: 'Orders',
      analytics: 'Analytics',
      iot: 'IoT Monitor',
      admin: 'Admin',
      createListing: 'Create Listing',
      exportMatch: 'Export Matching',
    },
    // Marketplace
    marketplace: {
      title: 'Marketplace',
      searchPlaceholder: 'Search by product name, grade, location...',
      filters: 'Filters',
      viewCard: 'Card View',
      viewList: 'List View',
      viewMap: 'Map View',
      emptyState: 'No listings yet — create your first listing in 60 seconds.',
      perTon: 'per ton',
      proposeOffer: 'Propose Offer',
      startEscrow: 'Start Escrow',
    },
    // Dashboard
    dashboard: {
      welcome: 'Welcome back',
      totalListings: 'Total Listings',
      activeOrders: 'Active Orders',
      revenue: 'Revenue',
      pendingActions: 'Pending Actions',
      recentActivity: 'Recent Activity',
      priceUpdates: 'Live Price Updates',
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View Details',
      close: 'Close',
    },
  },
  hi: {
    // Landing page
    hero: {
      title: 'हर बीज से कमाई',
      subtitle: 'जुड़ें, व्यापार करें, पूर्वानुमान लगाएं।',
      description: 'तिलहन उप-उत्पादों के लिए किसानों, प्रोसेसर और खरीदारों को जोड़ने वाला पूर्ण मूल्य श्रृंखला मंच।',
      joinFarmer: 'किसान के रूप में जुड़ें',
      joinProcessor: 'प्रोसेसर के रूप में जुड़ें',
      joinBuyer: 'खरीदार के रूप में जुड़ें',
    },
    // Navigation
    nav: {
      marketplace: 'बाज़ार',
      dashboard: 'डैशबोर्ड',
      orders: 'ऑर्डर',
      analytics: 'विश्लेषण',
      iot: 'IoT मॉनिटर',
      admin: 'व्यवस्थापक',
      createListing: 'लिस्टिंग बनाएं',
      exportMatch: 'निर्यात मिलान',
    },
    // Marketplace
    marketplace: {
      title: 'बाज़ार',
      searchPlaceholder: 'उत्पाद का नाम, ग्रेड, स्थान से खोजें...',
      filters: 'फ़िल्टर',
      viewCard: 'कार्ड व्यू',
      viewList: 'लिस्ट व्यू',
      viewMap: 'मैप व्यू',
      emptyState: 'अभी तक कोई लिस्टिंग नहीं — 60 सेकंड में अपनी पहली लिस्टिंग बनाएं।',
      perTon: 'प्रति टन',
      proposeOffer: 'प्रस्ताव दें',
      startEscrow: 'एस्क्रो शुरू करें',
    },
    // Dashboard
    dashboard: {
      welcome: 'स्वागत है',
      totalListings: 'कुल लिस्टिंग',
      activeOrders: 'सक्रिय ऑर्डर',
      revenue: 'राजस्व',
      pendingActions: 'लंबित कार्य',
      recentActivity: 'हाल की गतिविधि',
      priceUpdates: 'लाइव मूल्य अपडेट',
    },
    // Common
    common: {
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      view: 'विवरण देखें',
      close: 'बंद करें',
    },
  },
};

export function useTranslation(locale: Locale = 'en') {
  return translations[locale];
}
