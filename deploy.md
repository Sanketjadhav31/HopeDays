# Deployment Guide

This guide covers different deployment options for the Travel App.

## Environment Variables

### Backend (.env file)
Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
# For MongoDB Atlas (recommended for production):
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travel-app?retryWrites=true&w=majority

# For local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/travel-app

# CORS Configuration
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env file)
Create a `.env` file in the `frontend` directory with the following variables:

```env
# API Configuration
REACT_APP_API_URL=https://your-backend-domain.com/api

# For local development:
# REACT_APP_API_URL=http://localhost:5000/api
```

## Deployment Options

### 1. Docker Compose (Recommended for VPS/Cloud)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd travel-app
   ```

2. **Set up environment variables**
   - Copy `backend/env.example` to `backend/.env`
   - Copy `frontend/env.example` to `frontend/.env`
   - Update the values in both files

3. **Deploy with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://your-server-ip:3000
   - Backend API: http://your-server-ip:5000

### 2. Manual Deployment

#### Backend Deployment

1. **Install dependencies**
   ```bash
   cd backend
   npm install --production
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your values
   ```

3. **Start the server**
   ```bash
   npm start
   ```

#### Frontend Deployment

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your backend URL
   ```

3. **Build the application**
   ```bash
   npm run build
   ```

4. **Serve the build folder**
   - Use nginx, Apache, or any static file server
   - Point to the `build` folder

### 3. Cloud Platform Deployment

#### Backend (Render/Heroku)

1. **Connect your repository**
2. **Set environment variables**:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: production
   - `PORT`: (usually auto-set by platform)
   - `FRONTEND_URL`: Your frontend domain

3. **Deploy**

#### Frontend (Netlify/Vercel)

1. **Connect your repository**
2. **Set build settings**:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Environment variables:
     - `REACT_APP_API_URL`: Your backend API URL

3. **Deploy**

#### Database (MongoDB Atlas)

1. **Create a cluster** on MongoDB Atlas
2. **Set up database access**:
   - Create a database user
   - Whitelist your IP addresses
3. **Get connection string** and use it in your backend environment variables

## Production Checklist

### Security
- [ ] Use HTTPS in production
- [ ] Set secure environment variables
- [ ] Enable CORS for your frontend domain only
- [ ] Use MongoDB Atlas with proper authentication
- [ ] Set up proper firewall rules

### Performance
- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Configure proper caching headers
- [ ] Monitor application performance

### Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Monitor server resources
- [ ] Set up health checks
- [ ] Configure logging

## Sample Production URLs

- **Frontend**: https://travel-app-frontend.netlify.app
- **Backend**: https://travel-app-backend.render.com
- **Database**: MongoDB Atlas cluster

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `FRONTEND_URL` in backend matches your frontend domain
   - Check that the frontend is making requests to the correct backend URL

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has proper permissions

3. **Build Failures**
   - Check environment variables are set correctly
   - Verify all dependencies are installed
   - Check for any missing files

### Health Checks

- Backend: `GET /api/health`
- Frontend: `GET /health` (if using nginx)

## Support

For deployment issues, check:
1. Application logs
2. Environment variables
3. Network connectivity
4. Database connectivity
