import React, { useState, useEffect } from 'react';
import { destinationAPI } from '../services/api';

const DestinationList = ({ destinations, setDestinations, language, onSelectDestination }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    if (destinations.length === 0) {
      loadDestinations();
    }
  }, []);

  const loadDestinations = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await destinationAPI.getAll({
        search: searchTerm,
        sortBy,
        sortOrder
      });
      
      if (response.success) {
        setDestinations(response.data);
      }
    } catch (err) {
      setError('Failed to load destinations: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    await loadDestinations();
  };

  const handleSort = async (newSortBy) => {
    const newSortOrder = sortBy === newSortBy && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    
    const response = await destinationAPI.getAll({
      search: searchTerm,
      sortBy: newSortBy,
      sortOrder: newSortOrder
    });
    
    if (response.success) {
      setDestinations(response.data);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        const response = await destinationAPI.delete(id);
        if (response.success) {
          setDestinations(prev => prev.filter(dest => dest._id !== id));
        }
      } catch (err) {
        setError('Failed to delete destination: ' + err.message);
      }
    }
  };

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.description[language]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && destinations.length === 0) {
    return (
      <div className="content-section">
        <div className="loading-state">
          <span className="loading-spinner"></span>
          Loading destinations...
        </div>
      </div>
    );
  }

  return (
    <div className="content-section">
      <div className="list-container">
        <div className="list-header">
          <h2 className="section-title">
            🌍 Destinations
            <span className="badge">{destinations.length}</span>
          </h2>
          
          <div className="list-filters">
            <div className="filter-group">
              <label className="filter-label">Search</label>
              <div className="search-input-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search destinations..."
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
              <label className="filter-label">Sort By</label>
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="country">Country</option>
                <option value="createdAt">Date Added</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {filteredDestinations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🌍</div>
            <h3 className="empty-state-title">No destinations found</h3>
            <p className="empty-state-description">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Add your first destination to get started'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-3">
            {filteredDestinations.map(destination => (
              <div key={destination._id} className="item-card">
                <div className="item-card-header">
                  <h3 className="item-card-title">{destination.name}</h3>
                  <p className="item-card-subtitle">
                    📍 {destination.country}
                  </p>
                </div>
                
                <div className="item-card-body">
                  <p className={`item-card-description ${language === 'ar' ? 'arabic-text' : ''}`}>
                    {destination.description[language] || destination.description.en}
                  </p>
                  
                  <div className="item-card-details">
                    <div className="detail-item">
                      <span className="detail-label">Climate</span>
                      <span className="detail-value">{destination.climate}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Coordinates</span>
                      <span className="detail-value">
                        {destination.coordinates.latitude.toFixed(4)}, {destination.coordinates.longitude.toFixed(4)}
                      </span>
                    </div>
                    
                    {destination.bestTimeToVisit && (
                      <div className="detail-item">
                        <span className="detail-label">Best Time</span>
                        <span className="detail-value">{destination.bestTimeToVisit}</span>
                      </div>
                    )}
                    
                    {destination.hotelCount > 0 && (
                      <div className="detail-item">
                        <span className="detail-label">Hotels</span>
                        <span className="detail-value">{destination.hotelCount} available</span>
                      </div>
                    )}
                  </div>
                  
                  {destination.imageUrl && (
                    <div className="destination-image">
                      <img 
                        src={destination.imageUrl} 
                        alt={destination.name}
                        className="destination-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="item-card-footer">
                  <div className="destination-actions">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => onSelectDestination(destination)}
                    >
                      🏨 View Hotels
                    </button>
                  </div>
                  
                  <div className="item-actions">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(destination._id)}
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

export default DestinationList;
