import { pool } from '../db.js';

const handleError = (res, message, status = 400) => res.status(status).json({ success: false, message });

export async function getAllFarms(req, res) {
  try {
    const result = await pool.query('SELECT * FROM farms ORDER BY id');
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    return handleError(res, 'Unable to load farms', 500);
  }
}

export async function createFarm(req, res) {
  const { name, farmer_id, location, size, soil_type } = req.body;
  if (!name || !farmer_id) {
    return handleError(res, 'Missing required fields: name and farmer_id are required');
  }
  const numericSize = size === undefined || size === null ? null : Number(size);
  if (size !== undefined && Number.isNaN(numericSize)) {
    return handleError(res, 'Invalid size value');
  }
  try {
    const farmerResult = await pool.query('SELECT id FROM farmers WHERE id = $1', [farmer_id]);
    if (!farmerResult.rows.length) {
      return handleError(res, 'Parent farmer not found', 404);
    }
    const query = `INSERT INTO farms (name, farmer_id, location, size, soil_type) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const result = await pool.query(query, [name, farmer_id, location || null, numericSize, soil_type || null]);
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    return handleError(res, 'Unable to create farm', 500);
  }
}
