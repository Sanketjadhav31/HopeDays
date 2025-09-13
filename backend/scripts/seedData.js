const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Destination = require('../models/Destination');
const Hotel = require('../models/Hotel');

// Sample data
const sampleDestinations = [
  {
    name: "Paris",
    country: "France",
    description: {
      en: "The City of Light, known for its art, fashion, and iconic landmarks like the Eiffel Tower. A romantic city with world-class museums, charming cafes, and beautiful architecture.",
      ar: "مدينة النور، معروفة بفنها وأزيائها ومعالمها الشهيرة مثل برج إيفل. مدينة رومانسية مع متاحف عالمية المستوى ومقاهي ساحرة وعمارة جميلة."
    },
    coordinates: {
      latitude: 48.8566,
      longitude: 2.3522
    },
    climate: "Temperate",
    bestTimeToVisit: "Spring (April-June) and Fall (September-November)",
    imageUrl: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isActive: true
  },
  {
    name: "Tokyo",
    country: "Japan",
    description: {
      en: "A vibrant metropolis blending traditional culture with cutting-edge technology. Experience ancient temples, modern skyscrapers, and incredible cuisine.",
      ar: "عاصمة نابضة بالحياة تجمع بين الثقافة التقليدية والتكنولوجيا المتطورة. اختبر المعابد القديمة وناطحات السحاب الحديثة والمأكولات المذهلة."
    },
    coordinates: {
      latitude: 35.6762,
      longitude: 139.6503
    },
    climate: "Temperate",
    bestTimeToVisit: "Spring (March-May) and Fall (September-November)",
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isActive: true
  },
  {
    name: "Dubai",
    country: "UAE",
    description: {
      en: "A modern city in the desert, famous for luxury shopping, ultramodern architecture, and vibrant nightlife. Home to the world's tallest building.",
      ar: "مدينة حديثة في الصحراء، مشهورة بالتسوق الفاخر والهندسة المعمارية المتطورة والحياة الليلية النابضة بالحياة. موطن لأطول مبنى في العالم."
    },
    coordinates: {
      latitude: 25.2048,
      longitude: 55.2708
    },
    climate: "Arid",
    bestTimeToVisit: "Winter (November-March)",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isActive: true
  },
  {
    name: "New York",
    country: "USA",
    description: {
      en: "The Big Apple, a city that never sleeps. Experience Broadway shows, world-class museums, Central Park, and the iconic Statue of Liberty.",
      ar: "التفاحة الكبيرة، مدينة لا تنام أبداً. اختبر عروض برودواي والمتاحف عالمية المستوى وحديقة سنترال بارك وتمثال الحرية الشهير."
    },
    coordinates: {
      latitude: 40.7128,
      longitude: -74.0060
    },
    climate: "Continental",
    bestTimeToVisit: "Spring (April-June) and Fall (September-November)",
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isActive: true
  },
  {
    name: "London",
    country: "UK",
    description: {
      en: "The capital of England, rich in history and culture. Visit Buckingham Palace, the Tower of London, and enjoy traditional afternoon tea.",
      ar: "عاصمة إنجلترا، غنية بالتاريخ والثقافة. زر قصر باكنغهام وبرج لندن واستمتع بشاي بعد الظهر التقليدي."
    },
    coordinates: {
      latitude: 51.5074,
      longitude: -0.1278
    },
    climate: "Temperate",
    bestTimeToVisit: "Summer (June-August) and Spring (March-May)",
    imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isActive: true
  },
  {
    name: "Sydney",
    country: "Australia",
    description: {
      en: "Australia's largest city, famous for its harbor, Opera House, and beautiful beaches. A perfect blend of urban life and natural beauty.",
      ar: "أكبر مدينة في أستراليا، مشهورة بمينائها ودار الأوبرا وشواطئها الجميلة. مزيج مثالي من الحياة الحضرية والجمال الطبيعي."
    },
    coordinates: {
      latitude: -33.8688,
      longitude: 151.2093
    },
    climate: "Temperate",
    bestTimeToVisit: "Spring (September-November) and Fall (March-May)",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isActive: true
  }
];

const sampleHotels = [
  // Paris Hotels
  {
    name: "Hotel Ritz Paris",
    description: {
      en: "Luxury hotel in the heart of Paris, offering elegant rooms and world-class service. Located near the Louvre and Place Vendôme.",
      ar: "فندق فاخر في قلب باريس، يقدم غرف أنيقة وخدمة عالمية المستوى. يقع بالقرب من متحف اللوفر وساحة فاندوم."
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
    amenities: ["WiFi", "Spa", "Restaurant", "Room Service", "Business Center", "Parking"],
    starRating: 5,
    priceRange: {
      min: 800,
      max: 2000,
      currency: "EUR"
    },
    roomTypes: [
      {
        name: "Deluxe Room",
        price: 800,
        facilities: ["Air Conditioning", "WiFi", "TV", "Mini Bar", "Safe", "City View"],
        maxOccupancy: 2,
        size: "35 sqm"
      },
      {
        name: "Executive Suite",
        price: 1500,
        facilities: ["Air Conditioning", "WiFi", "TV", "Mini Bar", "Safe", "Balcony", "Sofa", "Work Desk"],
        maxOccupancy: 4,
        size: "65 sqm"
      },
      {
        name: "Presidential Suite",
        price: 2000,
        facilities: ["Air Conditioning", "WiFi", "TV", "Mini Bar", "Safe", "Balcony", "Sofa", "Work Desk", "Kitchenette", "Bathtub"],
        maxOccupancy: 6,
        size: "120 sqm"
      }
    ],
    nearbyAttractions: [
      {
        name: "Louvre Museum",
        distance: "1.2 km",
        description: {
          en: "World's largest art museum and historic monument",
          ar: "أكبر متحف فني في العالم ونصب تاريخي"
        }
      },
      {
        name: "Eiffel Tower",
        distance: "2.5 km",
        description: {
          en: "Iconic iron lattice tower and symbol of Paris",
          ar: "برج حديدي شبكي أيقوني ورمز باريس"
        }
      },
      {
        name: "Champs-Élysées",
        distance: "0.8 km",
        description: {
          en: "Famous avenue for shopping and entertainment",
          ar: "شارع شهير للتسوق والترفيه"
        }
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        caption: "Luxury suite with city view",
        isPrimary: true
      },
      {
        url: "https://picsum.photos/800/600",
        caption: "Hotel lobby",
        isPrimary: false
      },
      {
        url: "https://picsum.photos/1000/600",
        caption: "Restaurant view",
        isPrimary: false
      }
    ],
    availability: {
      isAvailable: true,
      checkInTime: "15:00",
      checkOutTime: "12:00"
    },
    isActive: true
  },
  {
    name: "Hotel Plaza Athénée",
    description: {
      en: "Iconic luxury hotel on Avenue Montaigne, featuring elegant rooms and exceptional dining experiences.",
      ar: "فندق فاخر أيقوني على شارع مونتين، يتميز بغرف أنيقة وتجارب طعام استثنائية."
    },
    address: {
      street: "25 Avenue Montaigne",
      city: "Paris",
      postalCode: "75008"
    },
    coordinates: {
      latitude: 48.8656,
      longitude: 2.3044
    },
    contact: {
      phone: "+33 1 53 67 66 65",
      email: "reservations@plaza-athenee-paris.com",
      website: "https://www.dorchestercollection.com/paris/plaza-athenee"
    },
    amenities: ["WiFi", "Spa", "Restaurant", "Bar", "Room Service", "Business Center"],
    starRating: 5,
    priceRange: {
      min: 600,
      max: 1800,
      currency: "EUR"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        caption: "Elegant lobby",
        isPrimary: true
      }
    ],
    availability: {
      isAvailable: true,
      checkInTime: "15:00",
      checkOutTime: "12:00"
    },
    isActive: true
  },
  // Tokyo Hotels
  {
    name: "The Peninsula Tokyo",
    description: {
      en: "Five-star luxury hotel with stunning views of Tokyo and impeccable service. Located in the heart of the city.",
      ar: "فندق فاخر بخمس نجوم مع إطلالات خلابة على طوكيو وخدمة لا تشوبها شائبة. يقع في قلب المدينة."
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
    amenities: ["WiFi", "Spa", "Pool", "Restaurant", "Bar", "Business Center", "Gym"],
    starRating: 5,
    priceRange: {
      min: 600,
      max: 1500,
      currency: "USD"
    },
    roomTypes: [
      {
        name: "Standard Room",
        price: 600,
        facilities: ["Air Conditioning", "WiFi", "TV", "Safe", "City View"],
        maxOccupancy: 2,
        size: "28 sqm"
      },
      {
        name: "Deluxe Room",
        price: 900,
        facilities: ["Air Conditioning", "WiFi", "TV", "Mini Bar", "Safe", "City View", "Work Desk"],
        maxOccupancy: 3,
        size: "42 sqm"
      },
      {
        name: "Executive Suite",
        price: 1500,
        facilities: ["Air Conditioning", "WiFi", "TV", "Mini Bar", "Safe", "City View", "Sofa", "Work Desk", "Bathtub"],
        maxOccupancy: 4,
        size: "75 sqm"
      }
    ],
    nearbyAttractions: [
      {
        name: "Tokyo Skytree",
        distance: "3.2 km",
        description: {
          en: "Tallest structure in Japan and broadcasting tower",
          ar: "أطول هيكل في اليابان وبرج البث"
        }
      },
      {
        name: "Senso-ji Temple",
        distance: "2.8 km",
        description: {
          en: "Ancient Buddhist temple in Asakusa",
          ar: "معبد بوذي قديم في أساكوسا"
        }
      },
      {
        name: "Tokyo Station",
        distance: "1.5 km",
        description: {
          en: "Major railway station and architectural landmark",
          ar: "محطة سكك حديدية رئيسية ومعلم معماري"
        }
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        caption: "Tokyo skyline view from room",
        isPrimary: true
      },
      {
        url: "https://picsum.photos/800/500",
        caption: "Hotel exterior",
        isPrimary: false
      },
      {
        url: "https://picsum.photos/1000/500",
        caption: "Spa area",
        isPrimary: false
      }
    ],
    availability: {
      isAvailable: true,
      checkInTime: "15:00",
      checkOutTime: "11:00"
    },
    isActive: true
  },
  {
    name: "Park Hyatt Tokyo",
    description: {
      en: "Luxury hotel in Shinjuku with panoramic city views, featuring world-class dining and spa facilities.",
      ar: "فندق فاخر في شينجوكو مع إطلالات بانورامية على المدينة، يتميز بمطاعم عالمية المستوى ومرافق سبا."
    },
    address: {
      street: "3-7-1-2 Nishi-Shinjuku",
      city: "Tokyo",
      postalCode: "163-1055"
    },
    coordinates: {
      latitude: 35.6852,
      longitude: 139.6906
    },
    contact: {
      phone: "+81 3 5322 1234",
      email: "tokyo.park@hyatt.com",
      website: "https://www.hyatt.com/hotels/tokyo-park-hyatt"
    },
    amenities: ["WiFi", "Spa", "Pool", "Restaurant", "Bar", "Business Center", "Gym", "Room Service"],
    starRating: 5,
    priceRange: {
      min: 500,
      max: 1200,
      currency: "USD"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        caption: "Modern room with city view",
        isPrimary: true
      }
    ],
    availability: {
      isAvailable: true,
      checkInTime: "15:00",
      checkOutTime: "11:00"
    },
    isActive: true
  },
  // Dubai Hotels
  {
    name: "Burj Al Arab",
    description: {
      en: "Iconic sail-shaped hotel, one of the most luxurious hotels in the world. Located on its own island with stunning views.",
      ar: "فندق على شكل شراع أيقوني، أحد أفخر الفنادق في العالم. يقع على جزيرته الخاصة مع إطلالات خلابة."
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
    amenities: ["WiFi", "Spa", "Pool", "Restaurant", "Bar", "Beach Access", "Helipad", "Room Service"],
    starRating: 5,
    priceRange: {
      min: 1000,
      max: 3000,
      currency: "AED"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        caption: "Iconic sail-shaped building",
        isPrimary: true
      }
    ],
    availability: {
      isAvailable: true,
      checkInTime: "15:00",
      checkOutTime: "12:00"
    },
    isActive: true
  },
  {
    name: "Atlantis The Palm",
    description: {
      en: "Luxury resort on the iconic Palm Jumeirah, featuring underwater suites and world-class entertainment.",
      ar: "منتجع فاخر على نخلة جميرا الشهيرة، يتميز بغرف تحت الماء وترفيه عالمي المستوى."
    },
    address: {
      street: "Crescent Road, Palm Jumeirah",
      city: "Dubai",
      postalCode: "00000"
    },
    coordinates: {
      latitude: 25.1124,
      longitude: 55.1180
    },
    contact: {
      phone: "+971 4 426 2000",
      email: "reservations@atlantisthepalm.com",
      website: "https://www.atlantisthepalm.com"
    },
    amenities: ["WiFi", "Spa", "Pool", "Restaurant", "Bar", "Beach Access", "Aquarium", "Water Park"],
    starRating: 5,
    priceRange: {
      min: 800,
      max: 2500,
      currency: "AED"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        caption: "Underwater suite view",
        isPrimary: true
      }
    ],
    availability: {
      isAvailable: true,
      checkInTime: "15:00",
      checkOutTime: "12:00"
    },
    isActive: true
  },
  // New York Hotels
  {
    name: "The Plaza New York",
    description: {
      en: "Historic luxury hotel overlooking Central Park, known for its elegance and timeless charm.",
      ar: "فندق فاخر تاريخي يطل على سنترال بارك، معروف بأناقته وسحره الخالد."
    },
    address: {
      street: "768 5th Avenue",
      city: "New York",
      postalCode: "10019"
    },
    coordinates: {
      latitude: 40.7648,
      longitude: -73.9748
    },
    contact: {
      phone: "+1 212 759 3000",
      email: "reservations@theplazany.com",
      website: "https://www.theplazany.com"
    },
    amenities: ["WiFi", "Spa", "Restaurant", "Bar", "Room Service", "Business Center", "Parking"],
    starRating: 5,
    priceRange: {
      min: 400,
      max: 1200,
      currency: "USD"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        caption: "Historic lobby",
        isPrimary: true
      }
    ],
    availability: {
      isAvailable: true,
      checkInTime: "15:00",
      checkOutTime: "12:00"
    },
    isActive: true
  },
  // London Hotels
  {
    name: "The Savoy London",
    description: {
      en: "Iconic luxury hotel on the River Thames, combining Edwardian elegance with modern amenities.",
      ar: "فندق فاخر أيقوني على نهر التايمز، يجمع بين الأناقة الإدواردية والمرافق الحديثة."
    },
    address: {
      street: "Strand",
      city: "London",
      postalCode: "WC2R 0EU"
    },
    coordinates: {
      latitude: 51.5103,
      longitude: -0.1206
    },
    contact: {
      phone: "+44 20 7836 4343",
      email: "reservations@thesavoylondon.com",
      website: "https://www.fairmont.com/savoy-london"
    },
    amenities: ["WiFi", "Spa", "Restaurant", "Bar", "Room Service", "Business Center", "Gym"],
    starRating: 5,
    priceRange: {
      min: 350,
      max: 1000,
      currency: "GBP"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        caption: "Elegant Thames view",
        isPrimary: true
      }
    ],
    availability: {
      isAvailable: true,
      checkInTime: "15:00",
      checkOutTime: "12:00"
    },
    isActive: true
  },
  // Sydney Hotels
  {
    name: "Park Hyatt Sydney",
    description: {
      en: "Luxury hotel with stunning views of the Sydney Opera House and Harbour Bridge.",
      ar: "فندق فاخر مع إطلالات خلابة على دار أوبرا سيدني وجسر الميناء."
    },
    address: {
      street: "7 Hickson Road",
      city: "Sydney",
      postalCode: "2000"
    },
    coordinates: {
      latitude: -33.8587,
      longitude: 151.2140
    },
    contact: {
      phone: "+61 2 9256 1234",
      email: "sydney.park@hyatt.com",
      website: "https://www.hyatt.com/hotels/sydney-park-hyatt"
    },
    amenities: ["WiFi", "Spa", "Pool", "Restaurant", "Bar", "Business Center", "Gym", "Room Service"],
    starRating: 5,
    priceRange: {
      min: 500,
      max: 1500,
      currency: "AUD"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        caption: "Opera House view from room",
        isPrimary: true
      }
    ],
    availability: {
      isAvailable: true,
      checkInTime: "15:00",
      checkOutTime: "11:00"
    },
    isActive: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://sanketjadhav3280:Password%40310@hopedays.cqoyiqh.mongodb.net/?retryWrites=true&w=majority&appName=Hopedays');
    console.log('Connected to MongoDB successfully!');

    // Clear existing data
    console.log('Clearing existing data...');
    await Destination.deleteMany({});
    await Hotel.deleteMany({});
    console.log('Existing data cleared!');

    // Insert destinations
    console.log('Inserting destinations...');
    const insertedDestinations = await Destination.insertMany(sampleDestinations);
    console.log(`${insertedDestinations.length} destinations inserted!`);

    // Insert hotels with destination references
    console.log('Inserting hotels...');
    const hotelsWithDestinations = sampleHotels.map((hotel, index) => {
      // Map hotels to destinations based on index
      let destinationIndex;
      if (index < 2) destinationIndex = 0; // Paris
      else if (index < 4) destinationIndex = 1; // Tokyo
      else if (index < 6) destinationIndex = 2; // Dubai
      else if (index < 7) destinationIndex = 3; // New York
      else if (index < 8) destinationIndex = 4; // London
      else destinationIndex = 5; // Sydney

      return {
        ...hotel,
        destination: insertedDestinations[destinationIndex]._id
      };
    });

    const insertedHotels = await Hotel.insertMany(hotelsWithDestinations);
    console.log(`${insertedHotels.length} hotels inserted!`);

    console.log('\n🎉 Database seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${insertedDestinations.length} destinations`);
    console.log(`   - ${insertedHotels.length} hotels`);
    console.log('\n🌍 Destinations added:');
    insertedDestinations.forEach(dest => {
      console.log(`   - ${dest.name}, ${dest.country}`);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();
