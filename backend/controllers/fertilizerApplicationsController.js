import { pool } from '../db.js';

const handleError = (res, message, status = 400) => res.status(status).json({ success: false, message });

export async function getAllFertilizerApplications(req, res) {
  try {
    const result = await pool.query('SELECT * FROM fertilizer_applications ORDER BY id');
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    return handleError(res, 'Unable to load fertilizer applications', 500);
  }
}

export async function createFertilizerApplication(req, res) {
  const { crop_cycle_id, fertilizer_type, quantity, application_date, notes } = req.body;
  if (!crop_cycle_id || !fertilizer_type || quantity === undefined || quantity === null) {
    return handleError(res, 'Missing required fields: crop_cycle_id, fertilizer_type, and quantity are required');
  }
  const numericQuantity = Number(quantity);
  if (Number.isNaN(numericQuantity)) {
    return handleError(res, 'Invalid quantity value');
  }
  try {
    const cycleResult = await pool.query('SELECT id FROM crop_cycles WHERE id = $1', [crop_cycle_id]);
    if (!cycleResult.rows.length) {
      return handleError(res, 'Parent crop cycle not found', 404);
    }
    const query = `INSERT INTO fertilizer_applications (crop_cycle_id, fertilizer_type, quantity, application_date, notes)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const result = await pool.query(query, [crop_cycle_id, fertilizer_type, numericQuantity, application_date || null, notes || null]);
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    return handleError(res, 'Unable to create fertilizer application', 500);
  }
}
