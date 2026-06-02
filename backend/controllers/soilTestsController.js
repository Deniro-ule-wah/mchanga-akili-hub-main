import { pool } from '../db.js';

const handleError = (res, message, status = 400) => res.status(status).json({ success: false, message });

function numericValue(value) {
  if (value === undefined || value === null || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function validatePh(ph) {
  const value = numericValue(ph);
  return value !== null && value >= 3.5 && value <= 9.0;
}

export async function getAllSoilTests(req, res) {
  try {
    const result = await pool.query('SELECT * FROM soil_tests ORDER BY id');
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    return handleError(res, 'Unable to load soil tests', 500);
  }
}

export async function createSoilTest(req, res) {
  const { farm_id, ph, nitrogen, phosphorus, potassium, organic_matter, test_date, notes } = req.body;
  if (!farm_id || ph === undefined || ph === null) {
    return handleError(res, 'Missing required fields: farm_id and ph are required');
  }
  if (!validatePh(ph)) {
    return handleError(res, 'pH value must be numeric and between 3.5 and 9.0');
  }
  const numericNitrogen = numericValue(nitrogen);
  const numericPhosphorus = numericValue(phosphorus);
  const numericPotassium = numericValue(potassium);
  const numericOrganicMatter = numericValue(organic_matter);

  try {
    const farmResult = await pool.query('SELECT id FROM farms WHERE id = $1', [farm_id]);
    if (!farmResult.rows.length) {
      return handleError(res, 'Parent farm not found', 404);
    }
    const query = `INSERT INTO soil_tests (farm_id, ph, nitrogen, phosphorus, potassium, organic_matter, test_date, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
    const result = await pool.query(query, [farm_id, Number(ph), numericNitrogen, numericPhosphorus, numericPotassium, numericOrganicMatter, test_date || null, notes || null]);
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    return handleError(res, 'Unable to create soil test', 500);
  }
}
