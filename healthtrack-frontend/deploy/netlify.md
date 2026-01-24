# Deploying HealthTrack Frontend to Netlify

## Prerequisites
- Netlify account
- Mapbox account (for map features)

## Steps

1. **Connect Repository**
   - Go to Netlify dashboard
   - Click "New site from Git"
   - Connect your repository
   - Select the `healthtrack-frontend` directory

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18.x or higher

3. **Environment Variables**
   Add these in Netlify's Environment variables:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_MAPBOX_TOKEN=your_mapbox_token
   ```

4. **Mapbox Token Setup**
   - Sign up at https://www.mapbox.com
   - Create an access token
   - Add it to environment variables as `VITE_MAPBOX_TOKEN`
   - The token will be embedded in the build

5. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy automatically
   - Update `FRONTEND_URL` in backend to match Netlify URL

6. **Custom Domain (Optional)**
   - Add your custom domain in Netlify settings
   - Update CORS in backend to include new domain

## Notes
- Mapbox has free tier with generous limits
- Vite environment variables must start with `VITE_`
- Rebuild after changing environment variables

