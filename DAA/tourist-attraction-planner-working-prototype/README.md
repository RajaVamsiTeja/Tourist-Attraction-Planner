# Tourist Attraction Planner

A React + Vite prototype for DAA Problem 76.

## Algorithms
- Greedy attraction selection using a feasibility + value/resource score.
- Two-resource 0/1 Knapsack using dynamic programming over budget and time.
- BFS graph traversal for attraction exploration order.

## Features
- Any-destination input architecture
- Demo datasets for Hyderabad, Goa, Delhi, Mumbai, Bengaluru, Chennai, Paris, London, Dubai, Tokyo and New York
- Login / Sign Up / Logout using localStorage
- Dashboard and recent trip history
- Feedback saved in localStorage
- Leaflet map
- Itinerary generation
- Algorithm comparison
- Graph visualization
- Responsive UI

## Run
```bash
npm install
npm run dev
```

## Notes
The demo attraction provider currently uses local data. For a real "any destination" deployment, replace `getAttractions()` with an API/database service that returns the same attraction object shape:

{
  id,
  name,
  destination,
  category,
  entryCost,
  visitTime,
  value,
  rating,
  latitude,
  longitude
}

No real password security should be inferred from localStorage authentication. A production app should use a secure backend/auth provider.
