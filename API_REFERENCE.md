# API Quick Reference

Base URL: `http://localhost:4000`

## Create Farmer

```bash
curl -X POST http://localhost:4000/farmers \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "phone": "+254700123456",
    "email": "john@example.com",
    "county": "Nakuru",
    "sub_county": "Njoro",
    "village": "Green Valley"
  }'
```

## Get All Farmers

```bash
curl -X GET http://localhost:4000/farmers
```

## Get Single Farmer

```bash
curl -X GET http://localhost:4000/farmers/1
```

## Update Farmer

```bash
curl -X PUT http://localhost:4000/farmers/1 \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Jane Doe",
    "phone": "+254700123457"
  }'
```

## Delete Farmer

```bash
curl -X DELETE http://localhost:4000/farmers/1
```

---

## Example Response (Success)

```json
{
  "success": true,
  "data": {
    "farmer_id": 1,
    "full_name": "John Doe",
    "phone": "+254700123456",
    "email": "john@example.com",
    "county": "Nakuru",
    "sub_county": "Njoro",
    "village": "Green Valley",
    "created_at": "2026-06-02T10:30:00.000Z"
  }
}
```

## Example Response (Error)

```json
{
  "success": false,
  "message": "Missing required fields: full_name and phone"
}
```

---

## Using Postman

1. **Import Collection**
   - Use the curl commands above as templates
   - Set request type to POST/GET/PUT/DELETE
   - Add JSON body for POST/PUT requests

2. **Set Headers**
   ```
   Content-Type: application/json
   ```

3. **Test Each Endpoint**
   - Create a farmer
   - List all farmers
   - Get single farmer
   - Update farmer
   - Delete farmer

---

## Testing in Frontend

Navigate to:
- http://localhost:5173/farmers - View all farmers
- http://localhost:5173/farmers/new - Add new farmer
- http://localhost:5173/farmers/1/edit - Edit farmer 1

Data will sync with backend in real-time!
