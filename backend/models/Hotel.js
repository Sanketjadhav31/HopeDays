const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hotel name is required'],
    trim: true,
    maxlength: [100, 'Hotel name cannot exceed 100 characters']
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: [true, 'Destination reference is required']
  },
  description: {
    en: {
      type: String,
      required: [true, 'English description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    ar: {
      type: String,
      required: [true, 'Arabic description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    }
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
      maxlength: [200, 'Street address cannot exceed 200 characters']
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      maxlength: [100, 'City name cannot exceed 100 characters']
    },
    postalCode: {
      type: String,
      trim: true,
      maxlength: [20, 'Postal code cannot exceed 20 characters']
    }
  },
  coordinates: {
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    }
  },
  contact: {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      validate: {
        validator: function(v) {
          return /^[\+]?[1-9][\d\s\-\(\)]{0,20}$/.test(v);
        },
        message: 'Please provide a valid phone number'
      }
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: 'Please provide a valid email address'
      }
    },
    website: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Please provide a valid website URL'
      }
    }
  },
  amenities: [{
    type: String,
    enum: [
      'WiFi', 'Parking', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 
      'Room Service', 'Laundry', 'Airport Shuttle', 'Pet Friendly',
      'Business Center', 'Conference Room', 'Beach Access', 'Mountain View',
      'Aquarium', 'Water Park', 'Helipad'
    ]
  }],
  starRating: {
    type: Number,
    required: [true, 'Star rating is required'],
    min: [1, 'Star rating must be at least 1'],
    max: [5, 'Star rating cannot exceed 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Star rating must be an integer'
    }
  },
  priceRange: {
    min: {
      type: Number,
      required: [true, 'Minimum price is required'],
      min: [0, 'Price cannot be negative']
    },
    max: {
      type: Number,
      required: [true, 'Maximum price is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      enum: ['USD', 'EUR', 'GBP', 'AED', 'SAR', 'EGP', 'AUD','INR'],
      default: 'USD'
    }
  },
  roomTypes: [{
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'Room type name cannot exceed 100 characters']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    facilities: [{
      type: String,
      enum: [
        'Air Conditioning', 'WiFi', 'TV', 'Mini Bar', 'Safe', 'Balcony',
        'Sea View', 'City View', 'Garden View', 'Kitchenette', 'Sofa',
        'Work Desk', 'Coffee Machine', 'Bathtub', 'Shower', 'Room Service'
      ]
    }],
    maxOccupancy: {
      type: Number,
      required: true,
      min: [1, 'Max occupancy must be at least 1'],
      max: [10, 'Max occupancy cannot exceed 10']
    },
    size: {
      type: String,
      trim: true,
      maxlength: [50, 'Room size cannot exceed 50 characters']
    }
  }],
  nearbyAttractions: [{
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'Attraction name cannot exceed 100 characters']
    },
    distance: {
      type: String,
      required: true,
      trim: true,
      maxlength: [20, 'Distance cannot exceed 20 characters']
    },
    description: {
      en: {
        type: String,
        trim: true,
        maxlength: [200, 'Description cannot exceed 200 characters']
      },
      ar: {
        type: String,
        trim: true,
        maxlength: [200, 'Description cannot exceed 200 characters']
      }
    }
  }],
  images: [{
    url: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(v) || /^https?:\/\/images\.unsplash\.com\/photo-/.test(v) || /^https?:\/\/picsum\.photos\/\d+\/\d+/.test(v);
        },
        message: 'Please provide a valid image URL'
      }
    },
    caption: {
      type: String,
      trim: true,
      maxlength: [200, 'Image caption cannot exceed 200 characters']
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    checkInTime: {
      type: String,
      default: '15:00'
    },
    checkOutTime: {
      type: String,
      default: '11:00'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for primary image
hotelSchema.virtual('primaryImage').get(function() {
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg ? primaryImg.url : (this.images.length > 0 ? this.images[0].url : null);
});

// Index for better query performance
hotelSchema.index({ destination: 1 });
hotelSchema.index({ name: 1 });
hotelSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });
hotelSchema.index({ starRating: -1 });
hotelSchema.index({ 'priceRange.min': 1, 'priceRange.max': 1 });

// Pre-save middleware
hotelSchema.pre('save', function(next) {
  // Capitalize first letter of name and city
  if (this.name) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
  }
  if (this.address.city) {
    this.address.city = this.address.city.charAt(0).toUpperCase() + this.address.city.slice(1).toLowerCase();
  }
  
  // Ensure only one primary image
  if (this.images && this.images.length > 0) {
    const primaryCount = this.images.filter(img => img.isPrimary).length;
    if (primaryCount === 0) {
      this.images[0].isPrimary = true;
    } else if (primaryCount > 1) {
      this.images.forEach((img, index) => {
        img.isPrimary = index === 0;
      });
    }
  }
  
  // Validate price range
  if (this.priceRange.min > this.priceRange.max) {
    return next(new Error('Minimum price cannot be greater than maximum price'));
  }
  
  next();
});

// Pre-validate middleware to check destination exists
hotelSchema.pre('validate', async function(next) {
  if (this.destination) {
    const Destination = mongoose.model('Destination');
    const destination = await Destination.findById(this.destination);
    if (!destination) {
      return next(new Error('Referenced destination does not exist'));
    }
  }
  next();
});

module.exports = mongoose.model('Hotel', hotelSchema);
