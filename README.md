# Travel App - Mini Travel Management System

# App Live Link = https://hopeday.netlify.app/

A full-stack travel application built with Express.js backend and React frontend, featuring destination and hotel management with multilingual support.

## Features

- **Destinations Management**: Add, view, and manage travel destinations
- **Hotels Management**: Add, view, edit, and delete hotels linked to destinations
- **Multilingual Support**: Support for English and Arabic descriptions
- **RESTful APIs**: Complete CRUD operations for both destinations and hotels
- **Modern UI**: Clean and responsive React frontend

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS for cross-origin requests

### Frontend
- React
- Axios for API calls
- Modern CSS with responsive design

## Project Structure

```
travel-app/
├── backend/           # Express.js server
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── middleware/   # Custom middleware
│   └── server.js     # Main server file
├── frontend/         # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API services
│   │   └── App.js      # Main App component
└── package.json      # Root package.json
```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/travel-app
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travel-app
NODE_ENV=development
```

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd travel-app
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   - Create `.env` file in the backend directory
   - Add your MongoDB connection string and other variables

4. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start both the backend server (port 5000) and React frontend (port 3000).

## API Endpoints

### Destinations
- `GET /api/destinations` - Get all destinations
- `POST /api/destinations` - Create a new destination

### Hotels
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/destination/:destinationId` - Get hotels by destination
- `POST /api/hotels` - Create a new hotel
- `PUT /api/hotels/:id` - Update a hotel
- `DELETE /api/hotels/:id` - Delete a hotel

## Deployment

### Backend Deployment (Render/Heroku)
1. Set environment variables in your deployment platform
2. Ensure MongoDB Atlas connection string is configured
3. Deploy the backend folder

### Frontend Deployment (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the build folder
3. Update API URLs to point to your deployed backend

### Database
- Use MongoDB Atlas for cloud database
- Update MONGODB_URI in your deployment environment

## Usage

1. **Add Destinations**: Use the "Add Destination" form to create new travel destinations
2. **Add Hotels**: Select a destination and add hotels with details
3. **View Hotels**: Select a destination from the dropdown to view associated hotels
4. **Edit/Delete**: Use the action buttons to modify or remove hotels

## Multilingual Support

The app supports multiple languages for descriptions. Currently supports:
- English (en)
- Arabic (ar)

Add more languages by extending the language options in the frontend components.

