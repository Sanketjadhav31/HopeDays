# Frontend Redeployment Guide

## Overview
After updating the API URL configuration in the frontend `.env` file, package.json proxy setting, and API service fallback URL, you need to rebuild and redeploy the frontend application for the changes to take effect. This document provides step-by-step instructions for this process.

## Steps to Rebuild and Redeploy

### 1. Local Testing (Optional but Recommended)

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Start the development server
npm start
```

Verify that the API requests are working correctly in your local environment before proceeding with deployment. The following changes have been made to ensure proper API connectivity:

1. Updated `.env` file with the correct backend URL: `REACT_APP_API_URL=https://travel-app-backend-tw9n.onrender.com/api`
2. Updated `package.json` proxy setting to: `"proxy": "https://travel-app-backend-tw9n.onrender.com"`
3. Updated API service fallback URL in `src/services/api.js` to use the production backend URL

### 2. Build the Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Build the production version
npm run build
```

This will create a `build` directory with optimized production files.

### 3. Deploy to Netlify

#### Option 1: Manual Deployment

1. Log in to your [Netlify account](https://app.netlify.com/)
2. Navigate to your site dashboard
3. Go to the "Deploys" tab
4. Click on "Deploy manually"
5. Drag and drop the `frontend/build` folder or click to browse and select it
6. Wait for the deployment to complete

#### Option 2: Git-based Deployment

1. Commit your changes to your Git repository:
   ```bash
   git add frontend/.env
   git commit -m "Fix: Update API URL to include /api prefix"
   git push
   ```

2. Netlify will automatically detect the changes and start a new deployment if you have continuous deployment set up.

#### Option 3: Netlify CLI Deployment

```bash
# Install Netlify CLI if not already installed
npm install -g netlify-cli

# Log in to Netlify
netlify login

# Deploy the site
cd frontend
netlify deploy --prod
```

### 4. Verify the Deployment

1. Once the deployment is complete, visit your Netlify site URL
2. Open the browser's developer tools (F12 or right-click and select "Inspect")
3. Go to the "Network" tab
4. Navigate through your application and verify that API requests are being made with the correct URL that includes the `/api` prefix
5. Confirm that the 404 errors are resolved

## Troubleshooting

### Common Issues

1. **Environment Variables Not Applied**
   - Netlify caches build configurations. Try clearing the cache in the Netlify dashboard under "Site settings" > "Build & deploy" > "Clear cache and deploy site"

2. **API Requests Still Failing**
   - Double-check the `.env` file to ensure the API URL is correct
   - Verify that the API URL is being correctly loaded in the application
   - Check if there are any CORS issues in the browser console

3. **Build Failures**
   - Review the build logs in the Netlify dashboard for any errors
   - Ensure all dependencies are correctly installed

## Next Steps

After successful redeployment, monitor the application for any issues and collect feedback from users to ensure everything is working as expected.