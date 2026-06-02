import { pool } from '../db.js';

const handleError = (res, message, status = 400) => res.status(status).json({ success: false, message });

export async function getAllYieldOutcomes(req, res) {
  try {
    const result = await pool.query('SELECT * FROM yield_outcomes ORDER BY id');
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    return handleError(res, 'Unable to load yield outcomes', 500);
  }
}

export async function createYieldOutcome(req, res) {
  const { crop_cycle_id, yield_amount, unit, harvest_date, notes } = req.body;
  if (!crop_cycle_id || yield_amount === undefined || yield_amount === null) {
    return handleError(res, 'Missing required fields: crop_cycle_id and yield_amount are required');
  }
  const numericYield = Number(yield_amount);
  if (Number.isNaN(numericYield)) {
    return handleError(res, 'Invalid yield_amount value');
  }
  try {
    const cycleResult = await pool.query('SELECT id FROM crop_cycles WHERE id = $1', [crop_cycle_id]);
    if (!cycleResult.rows.length) {
      return handleError(res, 'Parent crop cycle not found', 404);
    }
    const query = `INSERT INTO yield_outcomes (crop_cycle_id, yield_amount, unit, harvest_date, notes)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const result = await pool.query(query, [crop_cycle_id, numericYield, unit || null, harvest_date || null, notes || null]);
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    return handleError(res, 'Unable to create yield outcome', 500);
  }
}
