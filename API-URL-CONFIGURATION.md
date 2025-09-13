# API URL Configuration Guide

## Issue
The application was experiencing 404 errors when making API requests from the frontend to the backend. The errors occurred because the frontend was making requests to endpoints without the `/api` prefix, while the backend routes were configured with the `/api` prefix.

Error messages:
```
Making GET request to /destinations
GET https://travel-app-backend-tw9n.onrender.com/destinations 404 (Not Found)
API Error: {error: 'Route not found'}
Resource not found

Making GET request to /hotels
GET https://travel-app-backend-tw9n.onrender.com/hotels?search=&sortBy=starRating&sortOrder=desc 404 (Not Found)
API Error: {error: 'Route not found'}
Resource not found
```

## Root Cause

1. **Backend Route Configuration**: The backend server.js file configures routes with the `/api` prefix:
   ```javascript
   app.use('/api/destinations', destinationRoutes);
   app.use('/api/hotels', hotelRoutes);
   ```

2. **Frontend API Configuration**: The frontend .env file had an incorrect API URL configuration:
   ```
   REACT_APP_API_URL=https://travel-app-backend-tw9n.onrender.com
   ```
   This URL was missing the `/api` prefix required by the backend routes.

3. **API Service Implementation**: The frontend API service in `src/services/api.js` uses this base URL:
   ```javascript
   const api = axios.create({
     baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
     timeout: 10000,
     headers: {
       'Content-Type': 'application/json',
     },
   });
   ```
   When making requests like `api.get('/destinations')`, the resulting URL was missing the `/api` prefix.

## Solution

Updated the frontend .env file to include the `/api` prefix in the API URL:

```
REACT_APP_API_URL=https://travel-app-backend-tw9n.onrender.com/api
```

With this change, when the API service makes requests like `api.get('/destinations')`, the full URL will be:
`https://travel-app-backend-tw9n.onrender.com/api/destinations`

This correctly matches the backend route configuration.

## Deployment Steps

1. Update the frontend .env file with the correct API URL that includes the `/api` prefix
2. Rebuild and redeploy the frontend application
3. Test the application to ensure API requests are working correctly

## Best Practices

1. **Consistent Route Prefixing**: Always use consistent route prefixing across your application
2. **Environment Variable Documentation**: Document the required format for environment variables
3. **API URL Testing**: Test API URLs in both development and production environments
4. **Error Handling**: Implement comprehensive error handling for API requests

## Troubleshooting

If you encounter similar issues in the future:

1. Check the browser console for API request URLs and error messages
2. Verify that the frontend .env file has the correct API URL configuration
3. Confirm that the backend routes are configured as expected
4. Test API endpoints directly using tools like Postman or curl