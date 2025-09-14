import React, { useState, useEffect } from 'react';
import { hotelAPI, destinationAPI } from '../services/api';

const HotelList = ({ 
  hotels, 
  setHotels, 
  destinations, 
  selectedDestination, 
  setSelectedDestination, 
  language 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('starRating');
  const [sortOrder, setSortOrder] = useState('desc');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [starFilter, setStarFilter] = useState('');

  useEffect(() => {
    if (destinations.length === 0) {
      loadDestinations();
    }
  }, []);

  useEffect(() => {
    if (selectedDestination) {
      loadHotelsByDestination(selectedDestination._id);
    } else {
      loadAllHotels();
    }
  }, [selectedDestination, sortBy, sortOrder, minPrice, maxPrice, starFilter]);

  const loadDestinations = async () => {
    try {
      const response = await destinationAPI.getAll();
      if (response.success) {
        // This would need to be passed from parent component
        console.log('Destinations loaded:', response.data);
      }
    } catch (err) {
      setError('Failed to load destinations: ' + err.message);
    }
  };

  const loadAllHotels = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        search: searchTerm,
        sortBy,
        sortOrder
      };
      
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (starFilter) params.starRating = starFilter;
      
      const response = await hotelAPI.getAll(params);
      
      if (response.success) {
        setHotels(response.data);
      }
    } catch (err) {
      setError('Failed to load hotels: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadHotelsByDestination = async (destinationId) => {
    setLoading(true);
    setError('');
    try {
      const params = {
        sortBy,
        sortOrder
      };
      
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (starFilter) params.starRating = starFilter;
      
      const response = await hotelAPI.getByDestination(destinationId, params);
      
      if (response.success) {
        setHotels(response.data);
      }
    } catch (err) {
      setError('Failed to load hotels: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (selectedDestination) {
      await loadHotelsByDestination(selectedDestination._id);
    } else {
      await loadAllHotels();
    }
  };

  const handleSort = async (newSortBy) => {
    const newSortOrder = sortBy === newSortBy && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        const response = await hotelAPI.delete(id);
        if (response.success) {
          setHotels(prev => prev.filter(hotel => hotel._id !== id));
        }
      } catch (err) {
        setError('Failed to delete hotel: ' + err.message);
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setStarFilter('');
    setSortBy('starRating');
    setSortOrder('desc');
  };

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = !searchTerm || 
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.description[language]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.address.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = (!minPrice || hotel.priceRange.min >= parseFloat(minPrice)) &&
                        (!maxPrice || hotel.priceRange.max <= parseFloat(maxPrice));
    
    const matchesStar = !starFilter || hotel.starRating >= parseInt(starFilter);
    
    return matchesSearch && matchesPrice && matchesStar;
  });

  if (loading && hotels.length === 0) {
    return (
      <div className="content-section">
        <div className="loading-state">
          <span className="loading-spinner"></span>
          Loading hotels...
        </div>
      </div>
    );
  }

  return (
    <div className="content-section">
      <div className="list-container">
        <div className="list-header">
          <h2 className="section-title">
            🏨 Hotels
            {selectedDestination && (
              <span className="destination-badge">
                in {selectedDestination.name}, {selectedDestination.country}
              </span>
            )}
            <span className="badge">{hotels.length}</span>
          </h2>
          
          <div className="list-filters">
            <div className="filter-group">
              <label className="filter-label">Destination</label>
              <select
                className="filter-select"
                value={selectedDestination?._id || ''}
                onChange={(e) => {
                  const dest = destinations.find(d => d._id === e.target.value);
                  setSelectedDestination(dest || null);
                }}
              >
                <option value="">All Destinations</option>
                {destinations.map(dest => (
                  <option key={dest._id} value={dest._id}>
                    {dest.name}, {dest.country}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Search</label>
              <div className="search-input-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search hotels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  className="btn btn-outline btn-sm"
                  onClick={handleSearch}
                >
                  🔍
                </button>
              </div>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Min Price</label>
              <input
                type="number"
                className="form-input"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Max Price</label>
              <input
                type="number"
                className="form-input"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Min Stars</label>
              <select
                className="filter-select"
                value={starFilter}
                onChange={(e) => setStarFilter(e.target.value)}
              >
                <option value="">Any</option>
                <option value="1">1+ Star</option>
                <option value="2">2+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="starRating">Star Rating</option>
                <option value="name">Name</option>
                <option value="priceRange.min">Price</option>
                <option value="createdAt">Date Added</option>
              </select>
            </div>
            
            <button
              className="btn btn-outline btn-sm"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {filteredHotels.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏨</div>
            <h3 className="empty-state-title">No hotels found</h3>
            <p className="empty-state-description">
              {searchTerm || minPrice || maxPrice || starFilter
                ? 'Try adjusting your search filters'
                : selectedDestination
                  ? `No hotels found in ${selectedDestination.name}`
                  : 'Add your first hotel to get started'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-2">
            {filteredHotels.map(hotel => (
              <div key={hotel._id} className="item-card">
                <div className="item-card-header">
                  <h3 className="item-card-title">{hotel.name}</h3>
                  <p className="item-card-subtitle">
                    📍 {hotel.address.city}
                    {hotel.destination && (
                      <span> • {hotel.destination.name}, {hotel.destination.country}</span>
                    )}
                  </p>
                </div>
                
                <div className="item-card-body">
                  <p className={`item-card-description ${language === 'ar' ? 'arabic-text' : ''}`}>
                    {hotel.description[language] || hotel.description.en}
                  </p>
                  
                  <div className="item-card-details">
                    <div className="detail-item">
                      <span className="detail-label">Rating</span>
                      <span className="detail-value">
                        {'⭐'.repeat(hotel.starRating)} ({hotel.starRating} stars)
                      </span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Price Range</span>
                      <span className="detail-value">
                        {hotel.priceRange.min} - {hotel.priceRange.max} {hotel.priceRange.currency}
                      </span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Address</span>
                      <span className="detail-value">{hotel.address.street}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Contact</span>
                      <span className="detail-value">{hotel.contact.phone}</span>
                    </div>
                  </div>
                  
                  {hotel.amenities && hotel.amenities.length > 0 && (
                    <div className="amenities-list">
                      <span className="detail-label">Amenities:</span>
                      <div className="amenities-tags">
                        {hotel.amenities.slice(0, 5).map(amenity => (
                          <span key={amenity} className="amenity-tag">
                            {amenity}
                          </span>
                        ))}
                        {hotel.amenities.length > 5 && (
                          <span className="amenity-tag">
                            +{hotel.amenities.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {hotel.roomTypes && hotel.roomTypes.length > 0 && (
                    <div className="room-types-list">
                      <span className="detail-label">Room Types:</span>
                      <div className="room-types-grid">
                        {hotel.roomTypes.map((room, index) => (
                          <div key={index} className="room-type-card">
                            <div className="room-type-name">{room.name}</div>
                            <div className="room-type-price">{room.price} {hotel.priceRange.currency}</div>
                            <div className="room-type-details">
                              <span>Size: {room.size}</span>
                              <span>Max: {room.maxOccupancy} guests</span>
                            </div>
                            <div className="room-facilities">
                              {room.facilities.slice(0, 3).map(facility => (
                                <span key={facility} className="facility-tag">
                                  {facility}
                                </span>
                              ))}
                              {room.facilities.length > 3 && (
                                <span className="facility-tag">
                                  +{room.facilities.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {hotel.nearbyAttractions && hotel.nearbyAttractions.length > 0 && (
                    <div className="attractions-list">
                      <span className="detail-label">Nearby Attractions:</span>
                      <div className="attractions-grid">
                        {hotel.nearbyAttractions.map((attraction, index) => (
                          <div key={index} className="attraction-item">
                            <div className="attraction-name">{attraction.name}</div>
                            <div className="attraction-distance">{attraction.distance}</div>
                            <div className={`attraction-description ${language === 'ar' ? 'arabic-text' : ''}`}>
                              {attraction.description[language] || attraction.description.en}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {hotel.primaryImage && (
                    <div className="hotel-image">
                      <img 
                        src={hotel.primaryImage} 
                        alt={hotel.name}
                        className="hotel-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="item-card-footer">
                  <div className="hotel-actions">
                    <a
                      href={`mailto:${hotel.contact.email}`}
                      className="btn btn-outline btn-sm"
                    >
                      📧 Contact
                    </a>
                    {hotel.contact.website && (
                      <a
                        href={hotel.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                      >
                        🌐 Website
                      </a>
                    )}
                  </div>
                  
                  <div className="item-actions">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(hotel._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelList;
