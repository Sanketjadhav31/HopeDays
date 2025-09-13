# 🧪 Travel App Testing Guide

## Step-by-Step Testing Instructions

### 1. Environment Setup

**Backend Environment Variables:**
Create `backend/.env` file with:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration - Replace <db_password> with your actual password
MONGODB_URI=mongodb+srv://sj546400_db_user:<db_password>@hopdays.kohb4qn.mongodb.net/travel-app?retryWrites=true&w=majority&appName=Hopdays

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

**Frontend Environment Variables:**
Create `frontend/.env` file with:
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm run install-all
```

### 3. Add Sample Data to MongoDB

```bash
# Navigate to backend directory
cd backend

# Run the seed script to add sample data
npm run seed
```

This will add:
- 6 destinations (Paris, Tokyo, Dubai, New York, London, Sydney)
- 9 hotels across these destinations
- All with English and Arabic descriptions

### 4. Start the Application

```bash
# From the root directory, start both backend and frontend
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend on http://localhost:3000

### 5. Test All Features

#### 🌍 Destinations Tab
1. **View Destinations**: See all 6 sample destinations
2. **Search**: Try searching for "Paris" or "Tokyo"
3. **Sort**: Test sorting by name, country, or date
4. **Language Toggle**: Switch between English and Arabic
5. **View Hotels**: Click "View Hotels" button on any destination

#### 🏨 Hotels Tab
1. **View All Hotels**: See all 9 sample hotels
2. **Filter by Destination**: Select a destination from dropdown
3. **Search**: Search for hotel names or cities
4. **Price Filter**: Set min/max price ranges
5. **Star Rating Filter**: Filter by star ratings
6. **Sort**: Sort by rating, name, price, or date
7. **Contact**: Click contact buttons to test email/website links

#### ➕ Add Destination Tab
1. **Fill Form**: Add a new destination
2. **Coordinates**: Use "Use Current Location" button
3. **Multilingual**: Add descriptions in both English and Arabic
4. **Validation**: Test form validation with invalid data
5. **Submit**: Create the destination and see it in the list

#### 🏨 Add Hotel Tab
1. **Select Destination**: Choose from existing destinations
2. **Fill Details**: Add hotel information
3. **Amenities**: Select multiple amenities
4. **Pricing**: Set price range and currency
5. **Images**: Add image URLs
6. **Submit**: Create the hotel and see it in the list

### 6. Test Multilingual Support

1. **Language Toggle**: Use the EN/AR buttons in the header
2. **Descriptions**: See how descriptions change between languages
3. **Forms**: Notice Arabic text direction (RTL) in forms
4. **Navigation**: All UI elements should work in both languages

### 7. Test Responsive Design

1. **Desktop**: Test on full desktop screen
2. **Tablet**: Resize browser to tablet size
3. **Mobile**: Test on mobile screen size
4. **Navigation**: Ensure tabs work on all screen sizes

### 8. Test API Endpoints (Optional)

You can test the backend API directly using Postman or curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all destinations
curl http://localhost:5000/api/destinations

# Get hotels by destination
curl http://localhost:5000/api/hotels/destination/{destination_id}

# Search destinations
curl "http://localhost:5000/api/destinations?search=Paris"
```

### 9. Expected Results

After seeding, you should see:

**Destinations:**
- Paris, France
- Tokyo, Japan  
- Dubai, UAE
- New York, USA
- London, UK
- Sydney, Australia

**Hotels:**
- Paris: Hotel Ritz Paris, Hotel Plaza Athénée
- Tokyo: The Peninsula Tokyo, Park Hyatt Tokyo
- Dubai: Burj Al Arab, Atlantis The Palm
- New York: The Plaza New York
- London: The Savoy London
- Sydney: Park Hyatt Sydney

### 10. Troubleshooting

**Common Issues:**

1. **MongoDB Connection Error**: 
   - Check your password in the connection string
   - Ensure MongoDB Atlas IP whitelist includes your IP

2. **CORS Errors**:
   - Verify FRONTEND_URL in backend/.env matches your frontend URL

3. **API Not Found**:
   - Check REACT_APP_API_URL in frontend/.env
   - Ensure backend server is running on port 5000

4. **Build Errors**:
   - Run `npm install` in both backend and frontend directories
   - Check for any missing dependencies

### 11. Performance Testing

1. **Load Time**: Check how fast pages load
2. **Search Speed**: Test search functionality with large datasets
3. **Filter Performance**: Test filtering with multiple criteria
4. **Image Loading**: Verify images load properly

### 12. Browser Compatibility

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 🎉 Success Criteria

The app is working correctly if:
- ✅ All sample data loads properly
- ✅ Search and filtering work
- ✅ Forms submit successfully
- ✅ Multilingual support works
- ✅ Responsive design functions
- ✅ No console errors
- ✅ Fast loading times
- ✅ All CRUD operations work

Happy testing! 🚀
