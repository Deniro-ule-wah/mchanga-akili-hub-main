# ⚡ Quick Start - 2 Minutes

## Step 1: Backend (Terminal 1)

```bash
cd backend
npm install
npm start
```

✅ You should see: `Mchanga Afya Backend listening on port 4000`

## Step 2: Frontend (Terminal 2)

```bash
# In root directory
npm run dev
```

✅ You should see: `Local: http://localhost:5173/`

## Step 3: Open Browser

Navigate to: **http://localhost:5173**

## Step 4: Test Integration

1. Click **"View Farmers"** or go to `/farmers`
2. Click **"Add Farmer"** 
3. Fill form:
   - Full Name: Jane Doe
   - Phone: +254700123456
   - Email: jane@example.com
   - County: Nakuru
   - Village: Njoro
4. Submit
5. ✅ Farmer appears in list instantly!

---

## What Just Happened?

```
Form Input 
  ↓ (frontend)
Validation (Zod)
  ↓ (fetch)
POST http://localhost:4000/farmers
  ↓ (backend)
PostgreSQL INSERT
  ↓ (response)
JSON data returned
  ↓ (frontend)
React updates table
  ↓ (visible)
New farmer in list!
```

---

## Common Issues

| Issue | Fix |
|-------|-----|
| `Connection refused: 4000` | Backend not running. Run `npm start` in backend/ |
| `VITE_API_BASE_URL not set` | Check `.env.local` in root has `VITE_API_BASE_URL=http://localhost:4000` |
| `Database connection error` | Check PostgreSQL is running. Verify DATABASE_URL in backend/.env |
| `No farmers displayed` | Refresh page. Check browser console for errors. Check backend logs. |
| `Form validation errors` | Follow hints. Phone needs 9-15 digits. Name needs 2+ chars. |

---

## Verify Database

```bash
# In another terminal
psql postgresql://postgres:Mbichwatu@237@localhost:5432/agri_intelligence

# Inside psql:
SELECT * FROM farmers;

# Exit:
\q
```

---

## Files You Changed

- `src/lib/api.ts` - Added GET, PUT, DELETE methods
- `src/routes/farmers.tsx` - New list page
- `src/routes/farmers.new.tsx` - Updated form
- `src/routes/farmers.$farmer_id.edit.tsx` - New edit page
- `src/routes/index.tsx` - Updated dashboard
- `backend/seed.js` - Updated schema
- `backend/controllers/farmersController.js` - New field names
- `.env.local` - API configuration

---

## What's Working Now

✅ View all farmers  
✅ Add new farmer  
✅ Edit farmer  
✅ Delete farmer  
✅ Offline mode (queues changes)  
✅ Form validation  
✅ Error handling  
✅ Loading states  

---

## Next: Expand to Other Resources

Same pattern for:
- **Farms** - Create `src/routes/farms.tsx` + extend api.ts
- **Soil Tests** - Create `src/routes/soil-tests.tsx` + extend api.ts
- **Crop Cycles** - Create `src/routes/crop-cycles.tsx` + extend api.ts

Backend endpoints already exist and are ready!

---

**Enjoy! 🚀**
