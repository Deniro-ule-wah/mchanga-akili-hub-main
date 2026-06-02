# Mchanga Afya Backend

## Setup

1. Copy `.env.example` to `.env` and update `DATABASE_URL`.
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Seed the database:
   ```bash
   npm run seed
   ```
4. Start the API server:
   ```bash
   npm start
   ```

## API Endpoints

Farmers
- GET `/farmers`
- GET `/farmers/:id`
- POST `/farmers`
- PUT `/farmers/:id`
- DELETE `/farmers/:id`

Farms
- GET `/farms`
- POST `/farms`

Soil Tests
- GET `/soil-tests`
- POST `/soil-tests`

Crop Cycles
- GET `/crop-cycles`
- POST `/crop-cycles`

Fertilizer Applications
- GET `/fertilizer-applications`
- POST `/fertilizer-applications`

Yield Outcomes
- GET `/yield-outcomes`
- POST `/yield-outcomes`

Recommendations
- GET `/recommendations`
- POST `/recommendations`

## Notes

- The seeder creates tables if they do not exist.
- All inserts use parameterized queries.
- The `data/mchanga_afya.json` file should be replaced with your exported bootstrap JSON.
