# CORS Configuration Guide

## Issue
The application was experiencing CORS (Cross-Origin Resource Sharing) errors when the frontend at `https://hopeday.netlify.app` tried to access the backend at `https://travel-app-backend-tw9n.onrender.com`.

Error message:
```
Access to XMLHttpRequest at 'https://travel-app-backend-tw9n.onrender.com/destinations?search=&sortBy=name&sortOrder=asc' from origin 'https://hopeday.netlify.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Solution

### 1. Updated Backend CORS Configuration

In `backend/server.js`, we updated the allowed origins to include the frontend domain:

```javascript
// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://hopeday.netlify.app',
  process.env.FRONTEND_URL // Dynamically use the environment variable
].filter(Boolean); // Filter out any undefined or null values
```

This configuration:
- Explicitly allows the production frontend domain
- Dynamically includes the FRONTEND_URL from environment variables
- Uses filter(Boolean) to remove any null/undefined values

### 2. Updated Environment Variable in Render

In `render.yaml`, we updated the FRONTEND_URL environment variable to match the actual frontend URL:

```yaml
- key: FRONTEND_URL
  value: https://hopeday.netlify.app
```

## Deployment

After making these changes:

1. Commit and push the changes to your repository
2. Redeploy the backend service on Render
3. The backend will now accept requests from the frontend domain

## Troubleshooting

If CORS issues persist:

1. Verify that the backend has been redeployed with the new configuration
2. Check the Network tab in browser DevTools to confirm the correct headers are being sent
3. Ensure the frontend is making requests to the correct backend URL
4. Check if there are any proxy settings or CDN configurations that might be affecting the headers