import React, { useState, useEffect } from 'react';
import { hotelAPI, destinationAPI } from '../services/api';

const AddHotel = ({ hotels, setHotels, destinations, language }) => {
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    description: {
      en: '',
      ar: ''
    },
    address: {
      street: '',
      city: '',
      postalCode: ''
    },
    coordinates: {
      latitude: '',
      longitude: ''
    },
    contact: {
      phone: '',
      email: '',
      website: ''
    },
    amenities: [],
    starRating: 3,
    priceRange: {
      min: '',
      max: '',
      currency: 'USD'
    },
    images: [],
    availability: {
      checkInTime: '15:00',
      checkOutTime: '11:00'
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [destinationsLoading, setDestinationsLoading] = useState(false);

  const amenityOptions = [
    'WiFi', 'Parking', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar',
    'Room Service', 'Laundry', 'Airport Shuttle', 'Pet Friendly',
    'Business Center', 'Conference Room', 'Beach Access', 'Mountain View'
  ];

  const currencyOptions = ['USD', 'EUR', 'GBP', 'AED', 'SAR', 'EGP'];

  const starOptions = [1, 2, 3, 4, 5];

  useEffect(() => {
    if (destinations.length === 0) {
      loadDestinations();
    }
  }, []);

  const loadDestinations = async () => {
    setDestinationsLoading(true);
    try {
      const response = await destinationAPI.getAll();
      if (response.success) {
        // This would need to be passed from parent component
        console.log('Destinations loaded:', response.data);
      }
    } catch (err) {
      setError('Failed to load destinations: ' + err.message);
    } finally {
      setDestinationsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (type === 'checkbox') {
      if (name === 'amenities') {
        setFormData(prev => ({
          ...prev,
          amenities: checked
            ? [...prev.amenities, value]
            : prev.amenities.filter(amenity => amenity !== value)
        }));
      }
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
      if (!formData.name || !formData.destination || !formData.description.en || !formData.description.ar) {
        throw new Error('Please fill in all required fields');
      }

      if (!formData.address.street || !formData.address.city) {
        throw new Error('Please provide street address and city');
      }

      if (!formData.coordinates.latitude || !formData.coordinates.longitude) {
        throw new Error('Please provide both latitude and longitude');
      }

      if (!formData.contact.phone || !formData.contact.email) {
        throw new Error('Please provide phone number and email');
      }

      if (!formData.priceRange.min || !formData.priceRange.max) {
        throw new Error('Please provide both minimum and maximum price');
      }

      // Convert coordinates and prices to numbers
      const coordinates = {
        latitude: parseFloat(formData.coordinates.latitude),
        longitude: parseFloat(formData.coordinates.longitude)
      };

      const priceRange = {
        min: parseFloat(formData.priceRange.min),
        max: parseFloat(formData.priceRange.max),
        currency: formData.priceRange.currency
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

      // Validate prices
      if (isNaN(priceRange.min) || isNaN(priceRange.max)) {
        throw new Error('Please enter valid prices');
      }

      if (priceRange.min < 0 || priceRange.max < 0) {
        throw new Error('Prices cannot be negative');
      }

      if (priceRange.min > priceRange.max) {
        throw new Error('Minimum price cannot be greater than maximum price');
      }

      const hotelData = {
        ...formData,
        coordinates,
        priceRange,
        starRating: parseInt(formData.starRating)
      };

      const response = await hotelAPI.create(hotelData);
      
      if (response.success) {
        setHotels(prev => [response.data, ...prev]);
        setSuccess('Hotel created successfully!');
        resetForm();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      destination: '',
      description: {
        en: '',
        ar: ''
      },
      address: {
        street: '',
        city: '',
        postalCode: ''
      },
      coordinates: {
        latitude: '',
        longitude: ''
      },
      contact: {
        phone: '',
        email: '',
        website: ''
      },
      amenities: [],
      starRating: 3,
      priceRange: {
        min: '',
        max: '',
        currency: 'USD'
      },
      images: [],
      availability: {
        checkInTime: '15:00',
        checkOutTime: '11:00'
      }
    });
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
          <h3>🏨 Add New Hotel</h3>
          
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
                  Hotel Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Grand Hotel Paris"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="destination">
                  Destination *
                </label>
                <select
                  id="destination"
                  name="destination"
                  className="form-select"
                  value={formData.destination}
                  onChange={handleInputChange}
                  required
                  disabled={destinationsLoading}
                >
                  <option value="">
                    {destinationsLoading ? 'Loading destinations...' : 'Select a destination'}
                  </option>
                  {destinations.map(dest => (
                    <option key={dest._id} value={dest._id}>
                      {dest.name}, {dest.country}
                    </option>
                  ))}
                </select>
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
                placeholder="Describe the hotel in English..."
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
                placeholder="وصف الفندق باللغة العربية..."
                required
                dir="rtl"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Address *</label>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="address.street"
                    className="form-input"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    placeholder="Street Address"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="address.city"
                    className="form-input"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="address.postalCode"
                    className="form-input"
                    value={formData.address.postalCode}
                    onChange={handleInputChange}
                    placeholder="Postal Code"
                  />
                </div>
              </div>
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

            <div className="form-group">
              <label className="form-label">Contact Information *</label>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="tel"
                    name="contact.phone"
                    className="form-input"
                    value={formData.contact.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="contact.email"
                    className="form-input"
                    value={formData.contact.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="url"
                    name="contact.website"
                    className="form-input"
                    value={formData.contact.website}
                    onChange={handleInputChange}
                    placeholder="Website URL"
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="starRating">
                  Star Rating *
                </label>
                <select
                  id="starRating"
                  name="starRating"
                  className="form-select"
                  value={formData.starRating}
                  onChange={handleInputChange}
                  required
                >
                  {starOptions.map(star => (
                    <option key={star} value={star}>
                      {star} Star{star > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="currency">
                  Currency
                </label>
                <select
                  id="currency"
                  name="priceRange.currency"
                  className="form-select"
                  value={formData.priceRange.currency}
                  onChange={handleInputChange}
                >
                  {currencyOptions.map(currency => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Price Range *</label>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="number"
                    name="priceRange.min"
                    className="form-input"
                    value={formData.priceRange.min}
                    onChange={handleInputChange}
                    placeholder="Minimum Price"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    name="priceRange.max"
                    className="form-input"
                    value={formData.priceRange.max}
                    onChange={handleInputChange}
                    placeholder="Maximum Price"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Amenities</label>
              <div className="amenities-grid">
                {amenityOptions.map(amenity => (
                  <label key={amenity} className="amenity-checkbox">
                    <input
                      type="checkbox"
                      name="amenities"
                      value={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onChange={handleInputChange}
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
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
                    🏨 Create Hotel
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

export default AddHotel;
