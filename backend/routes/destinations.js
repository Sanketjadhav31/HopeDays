const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

// GET /api/destinations - Get all destinations
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, country, sortBy = 'name', sortOrder = 'asc' } = req.query;
    
    // Build query
    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { 'description.en': { $regex: search, $options: 'i' } },
        { 'description.ar': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query with pagination
    const destinations = await Destination.find(query)
      .populate('hotelCount')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();
    
    // Get total count for pagination
    const total = await Destination.countDocuments(query);
    
    res.json({
      success: true,
      data: destinations,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch destinations',
      message: error.message
    });
  }
});

// GET /api/destinations/:id - Get single destination
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id)
      .populate('hotelCount')
      .lean();
    
    if (!destination) {
      return res.status(404).json({
        success: false,
        error: 'Destination not found'
      });
    }
    
    res.json({
      success: true,
      data: destination
    });
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch destination',
      message: error.message
    });
  }
});

// POST /api/destinations - Create new destination
router.post('/', async (req, res) => {
  try {
    const {
      name,
      country,
      description,
      coordinates,
      imageUrl,
      climate,
      bestTimeToVisit
    } = req.body;
    
    // Validate required fields
    if (!name || !country || !description || !coordinates) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['name', 'country', 'description', 'coordinates']
      });
    }
    
    // Validate description structure
    if (!description.en || !description.ar) {
      return res.status(400).json({
        success: false,
        error: 'Description must include both English and Arabic versions'
      });
    }
    
    // Validate coordinates
    if (!coordinates.latitude || !coordinates.longitude) {
      return res.status(400).json({
        success: false,
        error: 'Coordinates must include both latitude and longitude'
      });
    }
    
    // Check if destination already exists
    const existingDestination = await Destination.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      country: { $regex: new RegExp(`^${country}$`, 'i') }
    });
    
    if (existingDestination) {
      return res.status(409).json({
        success: false,
        error: 'Destination with this name and country already exists'
      });
    }
    
    const destination = new Destination({
      name,
      country,
      description,
      coordinates,
      imageUrl,
      climate,
      bestTimeToVisit
    });
    
    const savedDestination = await destination.save();
    
    res.status(201).json({
      success: true,
      data: savedDestination,
      message: 'Destination created successfully'
    });
  } catch (error) {
    console.error('Error creating destination:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create destination',
      message: error.message
    });
  }
});

// PUT /api/destinations/:id - Update destination
router.put('/:id', async (req, res) => {
  try {
    const {
      name,
      country,
      description,
      coordinates,
      imageUrl,
      climate,
      bestTimeToVisit,
      isActive
    } = req.body;
    
    const updateData = {};
    
    if (name !== undefined) updateData.name = name;
    if (country !== undefined) updateData.country = country;
    if (description !== undefined) updateData.description = description;
    if (coordinates !== undefined) updateData.coordinates = coordinates;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (climate !== undefined) updateData.climate = climate;
    if (bestTimeToVisit !== undefined) updateData.bestTimeToVisit = bestTimeToVisit;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!destination) {
      return res.status(404).json({
        success: false,
        error: 'Destination not found'
      });
    }
    
    res.json({
      success: true,
      data: destination,
      message: 'Destination updated successfully'
    });
  } catch (error) {
    console.error('Error updating destination:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update destination',
      message: error.message
    });
  }
});

// DELETE /api/destinations/:id - Soft delete destination
router.delete('/:id', async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!destination) {
      return res.status(404).json({
        success: false,
        error: 'Destination not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Destination deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting destination:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete destination',
      message: error.message
    });
  }
});

// GET /api/destinations/search/suggestions - Get destination suggestions for autocomplete
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    const suggestions = await Destination.find({
      isActive: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { country: { $regex: q, $options: 'i' } }
      ]
    })
    .select('name country')
    .limit(parseInt(limit))
    .lean();
    
    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch suggestions',
      message: error.message
    });
  }
});

module.exports = router;
