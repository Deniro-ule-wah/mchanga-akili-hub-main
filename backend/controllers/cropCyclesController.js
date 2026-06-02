import { pool } from '../db.js';

const handleError = (res, message, status = 400) => res.status(status).json({ success: false, message });

export async function getAllCropCycles(req, res) {
  try {
    const result = await pool.query('SELECT * FROM crop_cycles ORDER BY id');
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    return handleError(res, 'Unable to load crop cycles', 500);
  }
}

export async function createCropCycle(req, res) {
  const { farm_id, crop_name, season, start_date, end_date, status } = req.body;
  if (!farm_id || !crop_name) {
    return handleError(res, 'Missing required fields: farm_id and crop_name are required');
  }
  try {
    const farmResult = await pool.query('SELECT id FROM farms WHERE id = $1', [farm_id]);
    if (!farmResult.rows.length) {
      return handleError(res, 'Parent farm not found', 404);
    }
    const query = `INSERT INTO crop_cycles (farm_id, crop_name, season, start_date, end_date, status)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const result = await pool.query(query, [farm_id, crop_name, season || null, start_date || null, end_date || null, status || null]);
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    return handleError(res, 'Unable to create crop cycle', 500);
  }
}
