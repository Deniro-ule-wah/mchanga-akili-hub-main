import { pool } from '../db.js';

const handleError = (res, message, status = 400) =>
  res.status(status).json({ success: false, message });

export async function getAllFarmers(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM farmers ORDER BY created_at DESC'
    );

    return res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error(error);
    return handleError(res, 'Unable to load farmers', 500);
  }
}

export async function getFarmerById(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM farmers WHERE farmer_id = $1',
      [id]
    );

    if (!result.rows.length) {
      return handleError(res, 'Farmer not found', 404);
    }

    return res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    return handleError(res, 'Unable to load farmer', 500);
  }
}

export async function createFarmer(req, res) {
  const {
    full_name,
    phone,
    email,
    county,
    sub_county,
    village
    , status
  } = req.body;

  if (!full_name || !phone) {
    return handleError(res, 'Missing required fields: full_name and phone');
  }

  try {
    const query = `
      INSERT INTO farmers
      (full_name, phone, email, county, sub_county, village, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await pool.query(query, [
      full_name,
      phone,
      email || null,
      county || null,
      sub_county || null,
      village || null,
      status || 'pending'
    ]);

    return res.status(201).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    return handleError(res, 'Unable to create farmer', 500);
  }
}

export async function updateFarmer(req, res) {
  const { id } = req.params;
  const {
    full_name,
    phone,
    email,
    county,
    sub_county,
    village
    , status
  } = req.body;

  const fields = [];
  const values = [];

  if (full_name !== undefined) {
    values.push(full_name);
    fields.push(`full_name = $${values.length}`);
  }

  if (phone !== undefined) {
    values.push(phone);
    fields.push(`phone = $${values.length}`);
  }

  if (email !== undefined) {
    values.push(email);
    fields.push(`email = $${values.length}`);
  }

  if (county !== undefined) {
    values.push(county);
    fields.push(`county = $${values.length}`);
  }

  if (sub_county !== undefined) {
    values.push(sub_county);
    fields.push(`sub_county = $${values.length}`);
  }

  if (village !== undefined) {
    values.push(village);
    fields.push(`village = $${values.length}`);
  }

  if (status !== undefined) {
    values.push(status);
    fields.push(`status = $${values.length}`);
  }

  if (!fields.length) {
    return handleError(res, 'No fields to update');
  }

  try {
    values.push(id);

    const query = `
      UPDATE farmers
      SET ${fields.join(', ')}
      WHERE farmer_id = $${values.length}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (!result.rows.length) {
      return handleError(res, 'Farmer not found', 404);
    }

    return res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    return handleError(res, 'Unable to update farmer', 500);
  }
}

export async function deleteFarmer(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM farmers WHERE farmer_id = $1 RETURNING *',
      [id]
    );

    if (!result.rows.length) {
      return handleError(res, 'Farmer not found', 404);
    }

    return res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    return handleError(res, 'Unable to delete farmer', 500);
  }
}