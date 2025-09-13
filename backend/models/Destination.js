const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Destination name is required'],
    trim: true,
    maxlength: [100, 'Destination name cannot exceed 100 characters']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    maxlength: [100, 'Country name cannot exceed 100 characters']
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
  imageUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(v) || /^https?:\/\/images\.unsplash\.com\/photo-/.test(v) || /^https?:\/\/picsum\.photos\/\d+\/\d+/.test(v);
      },
      message: 'Please provide a valid image URL'
    }
  },
  climate: {
    type: String,
    enum: ['Tropical', 'Temperate', 'Continental', 'Polar', 'Arid', 'Mediterranean'],
    default: 'Temperate'
  },
  bestTimeToVisit: {
    type: String,
    trim: true,
    maxlength: [200, 'Best time to visit cannot exceed 200 characters']
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

// Virtual for hotel count
destinationSchema.virtual('hotelCount', {
  ref: 'Hotel',
  localField: '_id',
  foreignField: 'destination',
  count: true
});

// Index for better query performance
destinationSchema.index({ name: 1, country: 1 });
destinationSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });

// Pre-save middleware to ensure data consistency
destinationSchema.pre('save', function(next) {
  // Capitalize first letter of name and country
  if (this.name) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
  }
  if (this.country) {
    this.country = this.country.charAt(0).toUpperCase() + this.country.slice(1).toLowerCase();
  }
  next();
});

module.exports = mongoose.model('Destination', destinationSchema);
