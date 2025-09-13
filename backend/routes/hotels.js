const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const Destination = require('../models/Destination');

// GET /api/hotels - Get all hotels with optional filtering
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      destination, 
      search, 
      minPrice, 
      maxPrice, 
      starRating, 
      amenities,
      sortBy = 'name', 
      sortOrder = 'asc' 
    } = req.query;
    
    // Build query
    const query = { isActive: true };
    
    if (destination) {
      query.destination = destination;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'description.en': { $regex: search, $options: 'i' } },
        { 'description.ar': { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (minPrice || maxPrice) {
      query['priceRange.min'] = {};
      if (minPrice) query['priceRange.min'].$gte = parseFloat(minPrice);
      if (maxPrice) query['priceRange.min'].$lte = parseFloat(maxPrice);
    }
    
    if (starRating) {
      query.starRating = { $gte: parseInt(starRating) };
    }
    
    if (amenities) {
      const amenityArray = Array.isArray(amenities) ? amenities : [amenities];
      query.amenities = { $in: amenityArray };
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query with pagination
    const hotels = await Hotel.find(query)
      .populate('destination', 'name country')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();
    
    // Get total count for pagination
    const total = await Hotel.countDocuments(query);
    
    res.json({
      success: true,
      data: hotels,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch hotels',
      message: error.message
    });
  }
});

// GET /api/hotels/destination/:destinationId - Get hotels by destination
router.get('/destination/:destinationId', async (req, res) => {
  try {
    const { destinationId } = req.params;
    const { page = 1, limit = 10, sortBy = 'starRating', sortOrder = 'desc' } = req.query;
    
    // Verify destination exists
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({
        success: false,
        error: 'Destination not found'
      });
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const hotels = await Hotel.find({ 
      destination: destinationId, 
      isActive: true 
    })
    .populate('destination', 'name country')
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();
    
    const total = await Hotel.countDocuments({ 
      destination: destinationId, 
      isActive: true 
    });
    
    res.json({
      success: true,
      data: hotels,
      destination: {
        id: destination._id,
        name: destination.name,
        country: destination.country
      },
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching hotels by destination:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch hotels',
      message: error.message
    });
  }
});

// GET /api/hotels/:id - Get single hotel
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('destination', 'name country description coordinates')
      .lean();
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        error: 'Hotel not found'
      });
    }
    
    res.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch hotel',
      message: error.message
    });
  }
});

// POST /api/hotels - Create new hotel
router.post('/', async (req, res) => {
  try {
    const {
      name,
      destination,
      description,
      address,
      coordinates,
      contact,
      amenities,
      starRating,
      priceRange,
      images,
      availability
    } = req.body;
    
    // Validate required fields
    if (!name || !destination || !description || !address || !coordinates || !contact || !starRating || !priceRange) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['name', 'destination', 'description', 'address', 'coordinates', 'contact', 'starRating', 'priceRange']
      });
    }
    
    // Validate description structure
    if (!description.en || !description.ar) {
      return res.status(400).json({
        success: false,
        error: 'Description must include both English and Arabic versions'
      });
    }
    
    // Verify destination exists
    const destinationExists = await Destination.findById(destination);
    if (!destinationExists) {
      return res.status(404).json({
        success: false,
        error: 'Referenced destination does not exist'
      });
    }
    
    // Validate coordinates
    if (!coordinates.latitude || !coordinates.longitude) {
      return res.status(400).json({
        success: false,
        error: 'Coordinates must include both latitude and longitude'
      });
    }
    
    // Validate contact information
    if (!contact.phone || !contact.email) {
      return res.status(400).json({
        success: false,
        error: 'Contact must include both phone and email'
      });
    }
    
    // Validate price range
    if (priceRange.min > priceRange.max) {
      return res.status(400).json({
        success: false,
        error: 'Minimum price cannot be greater than maximum price'
      });
    }
    
    const hotel = new Hotel({
      name,
      destination,
      description,
      address,
      coordinates,
      contact,
      amenities: amenities || [],
      starRating,
      priceRange,
      images: images || [],
      availability: availability || {}
    });
    
    const savedHotel = await hotel.save();
    await savedHotel.populate('destination', 'name country');
    
    res.status(201).json({
      success: true,
      data: savedHotel,
      message: 'Hotel created successfully'
    });
  } catch (error) {
    console.error('Error creating hotel:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create hotel',
      message: error.message
    });
  }
});

// PUT /api/hotels/:id - Update hotel
router.put('/:id', async (req, res) => {
  try {
    const {
      name,
      destination,
      description,
      address,
      coordinates,
      contact,
      amenities,
      starRating,
      priceRange,
      images,
      availability,
      isActive
    } = req.body;
    
    const updateData = {};
    
    if (name !== undefined) updateData.name = name;
    if (destination !== undefined) updateData.destination = destination;
    if (description !== undefined) updateData.description = description;
    if (address !== undefined) updateData.address = address;
    if (coordinates !== undefined) updateData.coordinates = coordinates;
    if (contact !== undefined) updateData.contact = contact;
    if (amenities !== undefined) updateData.amenities = amenities;
    if (starRating !== undefined) updateData.starRating = starRating;
    if (priceRange !== undefined) updateData.priceRange = priceRange;
    if (images !== undefined) updateData.images = images;
    if (availability !== undefined) updateData.availability = availability;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    // If destination is being updated, verify it exists
    if (destination) {
      const destinationExists = await Destination.findById(destination);
      if (!destinationExists) {
        return res.status(404).json({
          success: false,
          error: 'Referenced destination does not exist'
        });
      }
    }
    
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('destination', 'name country');
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        error: 'Hotel not found'
      });
    }
    
    res.json({
      success: true,
      data: hotel,
      message: 'Hotel updated successfully'
    });
  } catch (error) {
    console.error('Error updating hotel:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update hotel',
      message: error.message
    });
  }
});

// DELETE /api/hotels/:id - Soft delete hotel
router.delete('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        error: 'Hotel not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Hotel deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete hotel',
      message: error.message
    });
  }
});

// GET /api/hotels/search/suggestions - Get hotel suggestions for autocomplete
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q, destination, limit = 5 } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    const query = {
      isActive: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { 'address.city': { $regex: q, $options: 'i' } }
      ]
    };
    
    if (destination) {
      query.destination = destination;
    }
    
    const suggestions = await Hotel.find(query)
      .select('name address.city starRating')
      .populate('destination', 'name country')
      .limit(parseInt(limit))
      .lean();
    
    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Error fetching hotel suggestions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch suggestions',
      message: error.message
    });
  }
});

module.exports = router;
