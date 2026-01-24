# HealthTrack Backend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
PORT=5000
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user (protected)
- `PUT /api/users/me` - Update current user (protected)

### Entries
- `GET /api/entries` - Get all entries (protected)
- `POST /api/entries` - Create entry (protected)
- `PUT /api/entries/:id` - Update entry (protected)
- `DELETE /api/entries/:id` - Delete entry (protected)

### Goals
- `GET /api/goals` - Get all goals (protected)
- `POST /api/goals` - Create goal (protected)
- `PUT /api/goals/:id` - Update goal (protected)
- `DELETE /api/goals/:id` - Delete goal (protected)

### Dashboard
- `GET /api/dashboard/today` - Get today's stats (protected)
- `GET /api/dashboard/progress?metric=weight&from=YYYY-MM-DD&to=YYYY-MM-DD` - Get progress data (protected)

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

Tokens expire after 7 days.

