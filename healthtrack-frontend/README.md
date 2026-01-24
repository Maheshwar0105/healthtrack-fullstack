# HealthTrack Frontend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Features

- User authentication (Login/Register)
- Dashboard with today's stats and progress charts
- Entry management (Weight, Workout, Meal tracking)
- Goals management
- User profile management
- Responsive design with Tailwind CSS

