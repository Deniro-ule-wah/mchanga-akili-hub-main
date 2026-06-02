# Mchanga Afya - Frontend-Backend Integration Guide

## ✅ Integration Complete

The React frontend has been fully integrated with the Node.js/Express backend API.

## 📁 Files Created/Modified

### Frontend Files

**New Route Files:**
- [src/routes/farmers.tsx](src/routes/farmers.tsx) - Farmers list view with CRUD operations
- [src/routes/farmers.$farmer_id.edit.tsx](src/routes/farmers.$farmer_id.edit.tsx) - Edit farmer form
- [src/routes/farmers.new.tsx](src/routes/farmers.new.tsx) - **Updated** to use `full_name` and new fields

**API Integration:**
- [src/lib/api.ts](src/lib/api.ts) - **Extended** with:
  - `getFarmers()` - Fetch all farmers
  - `getFarmerById(id)` - Fetch single farmer
  - `updateFarmer(id, data)` - Update farmer
  - `deleteFarmer(id)` - Delete farmer
  - Updated `Farmer` interface to match backend schema

**Dashboard:**
- [src/routes/index.tsx](src/routes/index.tsx) - **Updated** with:
  - Link to Farmers list page
  - Live farmer count display
  - New "View Farmers" action button

**Environment:**
- [.env.local](.env.local) - Frontend API configuration

### Backend Files

**Database Schema:**
- [backend/seed.js](backend/seed.js) - **Updated** schema:
  - `farmers` table: `farmer_id` (primary key), `full_name`, `phone`, `email`, `county`, `sub_county`, `village`
  - Foreign key relationships aligned with `farmer_id`

**Controllers:**
- [backend/controllers/farmersController.js](backend/controllers/farmersController.js) - Full CRUD implementation with:
  - GET /farmers
  - GET /farmers/:id
  - POST /farmers
  - PUT /farmers/:id
  - DELETE /farmers/:id

---

## 🚀 Setup & Running

### Prerequisites

- Node.js v16+
- PostgreSQL running locally
- npm or yarn

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env (already created with DB credentials)
# DATABASE_URL=postgresql://postgres:Mbichwatu@237@localhost:5432/agri_intelligence

# Seed the database (creates tables and imports sample data)
npm run seed

# Start the API server
npm start
# Server runs on http://localhost:4000
```

### Frontend Setup

```bash
# Navigate to root directory
cd ..

# Install dependencies (if needed)
npm install

# Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 📊 Data Flow

```
User Form Input (Farmers Page)
         ↓
React Component State
         ↓
API Call (fetch with VITE_API_BASE_URL)
         ↓
Express Backend (http://localhost:4000)
         ↓
PostgreSQL Database
         ↓
JSON Response
         ↓
Frontend Re-renders with New Data
```

---

## 🔗 API Endpoints

All endpoints return JSON with the format:

**Success:**
```json
{
  "success": true,
  "data": { ...record or [records] }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

### Farmers Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/farmers` | List all farmers |
| GET | `/farmers/:id` | Get farmer by ID |
| POST | `/farmers` | Create new farmer |
| PUT | `/farmers/:id` | Update farmer |
| DELETE | `/farmers/:id` | Delete farmer |

---

## 📝 Farmer Schema

### Request/Response Fields

```typescript
{
  farmer_id: number;           // Auto-generated ID
  full_name: string;           // Required: 2-120 chars
  phone: string;               // Required: 9-15 digits (±prefix ok)
  email?: string | null;       // Optional: valid email format
  county: string;              // Required: select from county list
  sub_county?: string | null;  // Optional: sub-county name
  village: string;             // Required: 2-120 chars
  created_at: timestamp;       // Auto-generated on creation
}
```

---

## 🎯 Frontend Pages

### Dashboard (`/`)
- Quick stats showing farmer count
- Navigation cards to all major actions
- Link to Farmers list
- Offline queue status

### Farmers List (`/farmers`)
- Table view of all registered farmers
- Edit button (→ `/farmers/:farmer_id/edit`)
- Delete button with confirmation
- Add Farmer button (→ `/farmers/new`)
- Loading and error states

### Add Farmer (`/farmers/new`)
- Form with validation (Zod schema)
- Fields: full_name, phone, email, county, sub_county, village
- GPS capture (optional)
- Success/error notifications

### Edit Farmer (`/farmers/:farmer_id/edit`)
- Prefilled form with current farmer data
- Update individual fields
- Success/error notifications

---

## 🌐 Environment Configuration

**Frontend (`.env.local`):**
```
VITE_API_BASE_URL=http://localhost:4000
```

**Backend (`.env`):**
```
DATABASE_URL=postgresql://postgres:Mbichwatu@237@localhost:5432/agri_intelligence
PORT=4000
```

---

## 🔄 State Management

- **React Hooks Only**: `useState`, `useEffect`
- **No Redux**: Lightweight state per component
- **Offline Queue**: Built-in localStorage queue for offline mode
- **Auto-sync**: Queue syncs automatically when back online

---

## ✨ Key Features Implemented

✅ Full CRUD operations for farmers  
✅ Real-time data from PostgreSQL  
✅ Form validation (Zod schemas)  
✅ Error handling with user feedback  
✅ Loading states  
✅ Offline mode with queue system  
✅ Responsive design (preserved Lovable UI)  
✅ Field mapping: Frontend ↔ Backend  
✅ CORS enabled on backend  

---

## 🧪 Testing the Integration

1. **Start Backend:**
   ```bash
   cd backend && npm start
   ```

2. **Start Frontend:**
   ```bash
   npm run dev
   ```

3. **Test Flow:**
   - Navigate to http://localhost:5173
   - Click "View Farmers" or "Add Farmer"
   - Register a new farmer
   - Check the list updates in real-time
   - Edit and delete farmers

4. **Database Verification:**
   ```bash
   psql postgresql://postgres:Mbichwatu@237@localhost:5432/agri_intelligence
   SELECT * FROM farmers;
   ```

---

## 🚧 Next Steps

Ready to extend for:

1. **Farms Management**
   - Create `src/routes/farms.tsx` (list)
   - Create `src/routes/farms.new.tsx` (form)
   - Extend `api.ts` with farm operations

2. **Soil Tests**
   - Display soil data with validation
   - pH range checking (3.5-9.0)
   - Nutrient tracking

3. **Crop Cycles & Fertilizer**
   - Link to farms
   - Track applications
   - Yield outcomes

4. **AI Recommendations Engine**
   - Analyze soil + yield data
   - Suggest fertilizer optimization
   - Agricultural intelligence

---

## 📦 Tech Stack Summary

**Frontend:**
- React 19
- TanStack Router
- Zod validation
- Sonner notifications
- Lovable UI components (Radix + Tailwind)

**Backend:**
- Node.js + Express
- PostgreSQL
- pg (node-postgres)
- CORS enabled

**Communication:**
- REST API (JSON)
- Fetch API
- Offline queue (localStorage)

---

## 🔐 Security Notes

- ✅ Parameterized queries (no SQL injection)
- ✅ Input validation (Zod + server-side)
- ✅ CORS configured
- ✅ Graceful error handling
- ⚠️ TODO: Authentication/authorization layer
- ⚠️ TODO: Rate limiting
- ⚠️ TODO: HTTPS in production

---

## 📞 Support

Check logs for debugging:
- **Backend**: `npm start` console output
- **Frontend**: Browser DevTools console
- **Database**: Use psql for direct queries
