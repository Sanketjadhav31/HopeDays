import React, { useState, useEffect } from 'react';
import { destinationAPI } from '../services/api';

const AddDestination = ({ destinations, setDestinations, language }) => {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    description: {
      en: '',
      ar: ''
    },
    coordinates: {
      latitude: '',
      longitude: ''
    },
    imageUrl: '',
    climate: 'Temperate',
    bestTimeToVisit: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const climateOptions = [
    'Tropical', 'Temperate', 'Continental', 'Polar', 'Arid', 'Mediterranean'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.name || !formData.country || !formData.description.en || !formData.description.ar) {
        throw new Error('Please fill in all required fields');
      }

      if (!formData.coordinates.latitude || !formData.coordinates.longitude) {
        throw new Error('Please provide both latitude and longitude');
      }

      // Convert coordinates to numbers
      const coordinates = {
        latitude: parseFloat(formData.coordinates.latitude),
        longitude: parseFloat(formData.coordinates.longitude)
      };

      // Validate coordinates
      if (isNaN(coordinates.latitude) || isNaN(coordinates.longitude)) {
        throw new Error('Please enter valid coordinates');
      }

      if (coordinates.latitude < -90 || coordinates.latitude > 90) {
        throw new Error('Latitude must be between -90 and 90');
      }

      if (coordinates.longitude < -180 || coordinates.longitude > 180) {
        throw new Error('Longitude must be between -180 and 180');
      }

      const destinationData = {
        ...formData,
        coordinates
      };

      const response = await destinationAPI.create(destinationData);
      
      if (response.success) {
        setDestinations(prev => [response.data, ...prev]);
        setSuccess('Destination created successfully!');
        setFormData({
          name: '',
          country: '',
          description: {
            en: '',
            ar: ''
          },
          coordinates: {
            latitude: '',
            longitude: ''
          },
          imageUrl: '',
          climate: 'Temperate',
          bestTimeToVisit: ''
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            coordinates: {
              latitude: position.coords.latitude.toFixed(6),
              longitude: position.coords.longitude.toFixed(6)
            }
          }));
        },
        (error) => {
          setError('Unable to get current location: ' + error.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="content-section">
      <div className="form-container">
        <div className="form-section">
          <h3>🌍 Add New Destination</h3>
          
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}
          
          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Destination Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Paris, Tokyo, New York"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="country">
                  Country *
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  className="form-input"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="e.g., France, Japan, USA"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description.en">
                Description (English) *
              </label>
              <textarea
                id="description.en"
                name="description.en"
                className="form-textarea"
                value={formData.description.en}
                onChange={handleInputChange}
                placeholder="Describe the destination in English..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description.ar">
                Description (Arabic) *
              </label>
              <textarea
                id="description.ar"
                name="description.ar"
                className="form-textarea"
                value={formData.description.ar}
                onChange={handleInputChange}
                placeholder="وصف الوجهة باللغة العربية..."
                required
                dir="rtl"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="latitude">
                  Latitude *
                </label>
                <input
                  type="number"
                  id="latitude"
                  name="coordinates.latitude"
                  className="form-input"
                  value={formData.coordinates.latitude}
                  onChange={handleInputChange}
                  placeholder="e.g., 48.8566"
                  step="any"
                  min="-90"
                  max="90"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="longitude">
                  Longitude *
                </label>
                <input
                  type="number"
                  id="longitude"
                  name="coordinates.longitude"
                  className="form-input"
                  value={formData.coordinates.longitude}
                  onChange={handleInputChange}
                  placeholder="e.g., 2.3522"
                  step="any"
                  min="-180"
                  max="180"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={getCurrentLocation}
              >
                📍 Use Current Location
              </button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="climate">
                  Climate
                </label>
                <select
                  id="climate"
                  name="climate"
                  className="form-select"
                  value={formData.climate}
                  onChange={handleInputChange}
                >
                  {climateOptions.map(climate => (
                    <option key={climate} value={climate}>
                      {climate}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="bestTimeToVisit">
                  Best Time to Visit
                </label>
                <input
                  type="text"
                  id="bestTimeToVisit"
                  name="bestTimeToVisit"
                  className="form-input"
                  value={formData.bestTimeToVisit}
                  onChange={handleInputChange}
                  placeholder="e.g., Spring (March-May)"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="imageUrl">
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                className="form-input"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    ➕ Create Destination
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDestination;
