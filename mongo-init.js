// MongoDB initialization script
db = db.getSiblingDB('travel-app');

// Create collections
db.createCollection('destinations');
db.createCollection('hotels');

// Create indexes for better performance
db.destinations.createIndex({ "name": 1, "country": 1 });
db.destinations.createIndex({ "coordinates.latitude": 1, "coordinates.longitude": 1 });

db.hotels.createIndex({ "destination": 1 });
db.hotels.createIndex({ "name": 1 });
db.hotels.createIndex({ "starRating": -1 });
db.hotels.createIndex({ "priceRange.min": 1, "priceRange.max": 1 });

// Insert sample data
db.destinations.insertMany([
  {
    name: "Paris",
    country: "France",
    description: {
      en: "The City of Light, known for its art, fashion, and iconic landmarks like the Eiffel Tower.",
      ar: "مدينة النور، معروفة بفنها وأزيائها ومعالمها الشهيرة مثل برج إيفل."
    },
    coordinates: {
      latitude: 48.8566,
      longitude: 2.3522
    },
    climate: "Temperate",
    bestTimeToVisit: "Spring (April-June) and Fall (September-November)",
    imageUrl: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Tokyo",
    country: "Japan",
    description: {
      en: "A vibrant metropolis blending traditional culture with cutting-edge technology.",
      ar: "عاصمة نابضة بالحياة تجمع بين الثقافة التقليدية والتكنولوجيا المتطورة."
    },
    coordinates: {
      latitude: 35.6762,
      longitude: 139.6503
    },
    climate: "Temperate",
    bestTimeToVisit: "Spring (March-May) and Fall (September-November)",
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Dubai",
    country: "UAE",
    description: {
      en: "A modern city in the desert, famous for luxury shopping, ultramodern architecture, and vibrant nightlife.",
      ar: "مدينة حديثة في الصحراء، مشهورة بالتسوق الفاخر والهندسة المعمارية المتطورة والحياة الليلية النابضة بالحياة."
    },
    coordinates: {
      latitude: 25.2048,
      longitude: 55.2708
    },
    climate: "Arid",
    bestTimeToVisit: "Winter (November-March)",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Get the inserted destinations to use their IDs for hotels
const paris = db.destinations.findOne({ name: "Paris" });
const tokyo = db.destinations.findOne({ name: "Tokyo" });
const dubai = db.destinations.findOne({ name: "Dubai" });

db.hotels.insertMany([
  {
    name: "Hotel Ritz Paris",
    destination: paris._id,
    description: {
      en: "Luxury hotel in the heart of Paris, offering elegant rooms and world-class service.",
      ar: "فندق فاخر في قلب باريس، يقدم غرف أنيقة وخدمة عالمية المستوى."
    },
    address: {
      street: "15 Place Vendôme",
      city: "Paris",
      postalCode: "75001"
    },
    coordinates: {
      latitude: 48.8676,
      longitude: 2.3301
    },
    contact: {
      phone: "+33 1 43 16 30 30",
      email: "reservations@ritzparis.com",
      website: "https://www.ritzparis.com"
    },
    amenities: ["WiFi", "Spa", "Restaurant", "Room Service", "Business Center"],
    starRating: 5,
    priceRange: {
      min: 800,
      max: 2000,
      currency: "EUR"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        caption: "Luxury suite",
        isPrimary: true
      }
    ],
    availability: {
      isAvailable: true,
      checkInTime: "15:00",
      checkOutTime: "12:00"
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "The Peninsula Tokyo",
    destination: tokyo._id,
    description: {
      en: "Five-star luxury hotel with stunning views of Tokyo and impeccable service.",
      ar: "فندق فاخر بخمس نجوم مع إطلالات خلابة على طوكيو وخدمة لا تشوبها شائبة."
    },
    address: {
      street: "1-8-1 Yurakucho",
      city: "Tokyo",
      postalCode: "100-0006"
    },
    coordinates: {
      latitude: 35.6759,
      longitude: 139.7634
    },
    contact: {
      phone: "+81 3 6270 2888",
      email: "ptokyo@peninsula.com",
      website: "https://www.peninsula.com/tokyo"
    },
    amenities: ["WiFi", "Spa", "Pool", "Restaurant", "Bar", "Business Center"],
    starRating: 5,
    priceRange: {
      min: 600,
      max: 1500,
      currency: "USD"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        caption: "Tokyo skyline view",
        isPrimary: true
      }
    ],
    availability: {
      isAvailable: true,
      checkInTime: "15:00",
      checkOutTime: "11:00"
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Burj Al Arab",
    destination: dubai._id,
    description: {
      en: "Iconic sail-shaped hotel, one of the most luxurious hotels in the world.",
      ar: "فندق على شكل شراع أيقوني، أحد أفخر الفنادق في العالم."
    },
    address: {
      street: "Jumeirah Beach Road",
      city: "Dubai",
      postalCode: "00000"
    },
    coordinates: {
      latitude: 25.1413,
      longitude: 55.1853
    },
    contact: {
      phone: "+971 4 301 7777",
      email: "baa@jumeirah.com",
      website: "https://www.jumeirah.com/en/stay/dubai/burj-al-arab"
    },
    amenities: ["WiFi", "Spa", "Pool", "Restaurant", "Bar", "Beach Access", "Helipad"],
    starRating: 5,
    priceRange: {
      min: 1000,
      max: 3000,
      currency: "AED"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
        caption: "Iconic sail-shaped building",
        isPrimary: true
      }
    ],
    availability: {
      isAvailable: true,
      checkInTime: "15:00",
      checkOutTime: "12:00"
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("Database initialized successfully with sample data!");
