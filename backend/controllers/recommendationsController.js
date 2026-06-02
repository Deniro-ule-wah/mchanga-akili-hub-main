import { pool } from '../db.js';

const handleError = (res, message, status = 400) => res.status(status).json({ success: false, message });

export async function getAllRecommendations(req, res) {
  try {
    const result = await pool.query('SELECT * FROM recommendations ORDER BY id');
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    return handleError(res, 'Unable to load recommendations', 500);
  }
}

export async function createRecommendation(req, res) {
  const { farmer_id, farm_id, crop_cycle_id, recommendation_text } = req.body;
  if (!recommendation_text) {
    return handleError(res, 'Missing required field: recommendation_text');
  }
  try {
    if (farmer_id) {
      const farmerResult = await pool.query('SELECT id FROM farmers WHERE id = $1', [farmer_id]);
      if (!farmerResult.rows.length) {
        return handleError(res, 'Referenced farmer not found', 404);
      }
    }
    if (farm_id) {
      const farmResult = await pool.query('SELECT id FROM farms WHERE id = $1', [farm_id]);
      if (!farmResult.rows.length) {
        return handleError(res, 'Referenced farm not found', 404);
      }
    }
    if (crop_cycle_id) {
      const cycleResult = await pool.query('SELECT id FROM crop_cycles WHERE id = $1', [crop_cycle_id]);
      if (!cycleResult.rows.length) {
        return handleError(res, 'Referenced crop cycle not found', 404);
      }
    }
    const query = `INSERT INTO recommendations (farmer_id, farm_id, crop_cycle_id, recommendation_text)
      VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await pool.query(query, [farmer_id || null, farm_id || null, crop_cycle_id || null, recommendation_text]);
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    return handleError(res, 'Unable to create recommendation', 500);
  }
}
