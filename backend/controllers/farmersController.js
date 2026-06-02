import { pool } from '../db.js';

const handleError = (res, message, status = 400) => res.status(status).json({ success: false, message });

export async function getAllFarmers(req, res) {
  try {
    const result = await pool.query('SELECT * FROM farmers ORDER BY id');
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    return handleError(res, 'Unable to load farmers', 500);
  }
}

export async function getFarmerById(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM farmers WHERE id = $1', [id]);
    if (!result.rows.length) {
      return handleError(res, 'Farmer not found', 404);
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    return handleError(res, 'Unable to load farmer', 500);
  }
}

export async function createFarmer(req, res) {
  const { name, email, phone, region } = req.body;
  if (!name || !phone) {
    return handleError(res, 'Missing required fields: name and phone are required');
  }
  try {
    const query = `INSERT INTO farmers (name, email, phone, region) VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await pool.query(query, [name, email || null, phone, region || null]);
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    return handleError(res, 'Unable to create farmer', 500);
  }
}

export async function updateFarmer(req, res) {
  const { id } = req.params;
  const { name, email, phone, region } = req.body;
  const fields = [];
  const values = [];

  if (name !== undefined) {
    values.push(name);
    fields.push(`name = $${values.length}`);
  }
  if (email !== undefined) {
    values.push(email);
    fields.push(`email = $${values.length}`);
  }
  if (phone !== undefined) {
    values.push(phone);
    fields.push(`phone = $${values.length}`);
  }
  if (region !== undefined) {
    values.push(region);
    fields.push(`region = $${values.length}`);
  }

  if (!fields.length) {
    return handleError(res, 'No updatable fields provided');
  }

  try {
    values.push(id);
    const query = `UPDATE farmers SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`;
    const result = await pool.query(query, values);
    if (!result.rows.length) {
      return handleError(res, 'Farmer not found', 404);
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    return handleError(res, 'Unable to update farmer', 500);
  }
}

export async function deleteFarmer(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM farmers WHERE id = $1 RETURNING *', [id]);
    if (!result.rows.length) {
      return handleError(res, 'Farmer not found', 404);
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    return handleError(res, 'Unable to delete farmer', 500);
  }
}
