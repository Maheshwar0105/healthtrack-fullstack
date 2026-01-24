# Deploying HealthTrack Backend to Render

## Prerequisites
- Render account
- MongoDB Atlas account (or MongoDB instance)
- Mapbox account (optional, for reverse geocoding)

## Steps

1. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Select the `healthtrack-backend` directory
   - Build command: `npm install`
   - Start command: `npm start`

2. **Environment Variables**
   Add these in Render's Environment section:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key_here
   PORT=5000
   MAPBOX_TOKEN=your_mapbox_token (optional)
   ENABLE_SOCKETIO=true (or false)
   FRONTEND_URL=https://your-frontend-url.com
   ```

3. **CORS Configuration**
   - Ensure `FRONTEND_URL` matches your frontend deployment URL
   - The backend will allow CORS from this origin

4. **Socket.io Considerations**
   - If using Socket.io, ensure WebSocket support is enabled
   - Render supports WebSockets by default
   - Set `ENABLE_SOCKETIO=true` in environment variables

5. **Database Setup**
   - Use MongoDB Atlas or another MongoDB service
   - The app will automatically create indexes on first run
   - Run seed script if needed: `npm run seed:locations`

6. **Health Check**
   - Render will check `http://your-service.onrender.com/api/health` (add this endpoint if needed)

## Notes
- Free tier has limitations on WebSocket connections
- Consider upgrading for production use
- Monitor logs for any connection issues

