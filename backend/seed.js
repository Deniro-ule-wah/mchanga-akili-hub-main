import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { pool } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, 'data', 'mchanga_afya.json');

function numericValue(value) {
  if (value === null || value === undefined || value === '') return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function validatePh(ph) {
  const value = numericValue(ph);
  return value !== null && value >= 3.5 && value <= 9.0;
}

function validateRecordExists(item, label) {
  if (!item) {
    throw new Error(`${label} record is required`);
  }
}

async function createTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS farmers (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      region TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS farms (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      farmer_id INTEGER NOT NULL,
      location TEXT,
      size NUMERIC,
      soil_type TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      CONSTRAINT farms_farmer_fk FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS soil_tests (
      id SERIAL PRIMARY KEY,
      farm_id INTEGER NOT NULL,
      ph NUMERIC CHECK (ph >= 3.5 AND ph <= 9.0),
      nitrogen NUMERIC,
      phosphorus NUMERIC,
      potassium NUMERIC,
      organic_matter NUMERIC,
      test_date DATE,
      notes TEXT,
      CONSTRAINT soil_tests_farm_fk FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS crop_cycles (
      id SERIAL PRIMARY KEY,
      farm_id INTEGER NOT NULL,
      crop_name TEXT NOT NULL,
      season TEXT,
      start_date DATE,
      end_date DATE,
      status TEXT,
      CONSTRAINT crop_cycles_farm_fk FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS fertilizer_applications (
      id SERIAL PRIMARY KEY,
      crop_cycle_id INTEGER NOT NULL,
      fertilizer_type TEXT NOT NULL,
      quantity NUMERIC NOT NULL,
      application_date DATE,
      notes TEXT,
      CONSTRAINT fertilizer_applications_cycle_fk FOREIGN KEY (crop_cycle_id) REFERENCES crop_cycles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS yield_outcomes (
      id SERIAL PRIMARY KEY,
      crop_cycle_id INTEGER NOT NULL,
      yield_amount NUMERIC NOT NULL,
      unit TEXT,
      harvest_date DATE,
      notes TEXT,
      CONSTRAINT yield_outcomes_cycle_fk FOREIGN KEY (crop_cycle_id) REFERENCES crop_cycles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS recommendations (
      id SERIAL PRIMARY KEY,
      farmer_id INTEGER,
      farm_id INTEGER,
      crop_cycle_id INTEGER,
      recommendation_text TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      CONSTRAINT recommendations_farmer_fk FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE SET NULL,
      CONSTRAINT recommendations_farm_fk FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE SET NULL,
      CONSTRAINT recommendations_cycle_fk FOREIGN KEY (crop_cycle_id) REFERENCES crop_cycles(id) ON DELETE SET NULL
    );
  `);
}

async function updateSerialSequences() {
  const sequences = [
    { table: 'farmers', column: 'id' },
    { table: 'farms', column: 'id' },
    { table: 'soil_tests', column: 'id' },
    { table: 'crop_cycles', column: 'id' },
    { table: 'fertilizer_applications', column: 'id' },
    { table: 'yield_outcomes', column: 'id' },
    { table: 'recommendations', column: 'id' },
  ];

  for (const { table, column } of sequences) {
    const result = await pool.query(`SELECT MAX(${column}) AS max_id FROM ${table}`);
    const maxId = result.rows[0]?.max_id;
    if (maxId !== null && maxId !== undefined) {
      await pool.query(`SELECT setval(pg_get_serial_sequence($1, $2), $3, true)`, [table, column, maxId]);
    }
  }
}

async function seed() {
  console.log('Reading seed file:', dataFilePath);
  const raw = await readFile(dataFilePath, 'utf8');
  const data = JSON.parse(raw);

  await createTables();

  await pool.query('BEGIN');

  try {
    const farmers = Array.isArray(data.farmers) ? data.farmers : [];
    for (const farmer of farmers) {
      validateRecordExists(farmer.name, 'Farmer name');
      const query = `INSERT INTO farmers (id, name, email, phone, region, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING`; 
      await pool.query(query, [farmer.id || null, farmer.name, farmer.email || null, farmer.phone || null, farmer.region || null, farmer.created_at || null]);
    }

    const farms = Array.isArray(data.farms) ? data.farms : [];
    for (const farm of farms) {
      validateRecordExists(farm.name, 'Farm name');
      validateRecordExists(farm.farmer_id, 'Farm farmer_id');
      const size = numericValue(farm.size);
      const query = `INSERT INTO farms (id, name, farmer_id, location, size, soil_type, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO NOTHING`;
      await pool.query(query, [farm.id || null, farm.name, farm.farmer_id, farm.location || null, size, farm.soil_type || null, farm.created_at || null]);
    }

    const soilTests = Array.isArray(data.soil_tests) ? data.soil_tests : [];
    for (const soilTest of soilTests) {
      validateRecordExists(soilTest.farm_id, 'Soil test farm_id');
      if (!validatePh(soilTest.ph)) {
        throw new Error(`Invalid pH for soil test id ${soilTest.id}`);
      }
      const query = `INSERT INTO soil_tests (id, farm_id, ph, nitrogen, phosphorus, potassium, organic_matter, test_date, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO NOTHING`;
      await pool.query(query, [soilTest.id || null, soilTest.farm_id, numericValue(soilTest.ph), numericValue(soilTest.nitrogen), numericValue(soilTest.phosphorus), numericValue(soilTest.potassium), numericValue(soilTest.organic_matter), soilTest.test_date || null, soilTest.notes || null]);
    }

    const cropCycles = Array.isArray(data.crop_cycles) ? data.crop_cycles : [];
    for (const cycle of cropCycles) {
      validateRecordExists(cycle.farm_id, 'Crop cycle farm_id');
      validateRecordExists(cycle.crop_name, 'Crop cycle crop_name');
      const query = `INSERT INTO crop_cycles (id, farm_id, crop_name, season, start_date, end_date, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO NOTHING`;
      await pool.query(query, [cycle.id || null, cycle.farm_id, cycle.crop_name, cycle.season || null, cycle.start_date || null, cycle.end_date || null, cycle.status || null]);
    }

    const fertilizerApplications = Array.isArray(data.fertilizer_applications) ? data.fertilizer_applications : [];
    for (const app of fertilizerApplications) {
      validateRecordExists(app.crop_cycle_id, 'Fertilizer application crop_cycle_id');
      validateRecordExists(app.fertilizer_type, 'Fertilizer application fertilizer_type');
      const quantity = numericValue(app.quantity);
      if (quantity === null) {
        throw new Error(`Invalid quantity for fertilizer application id ${app.id}`);
      }
      const query = `INSERT INTO fertilizer_applications (id, crop_cycle_id, fertilizer_type, quantity, application_date, notes)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING`;
      await pool.query(query, [app.id || null, app.crop_cycle_id, app.fertilizer_type, quantity, app.application_date || null, app.notes || null]);
    }

    const yieldOutcomes = Array.isArray(data.yield_outcomes) ? data.yield_outcomes : [];
    for (const yieldOutcome of yieldOutcomes) {
      validateRecordExists(yieldOutcome.crop_cycle_id, 'Yield outcome crop_cycle_id');
      validateRecordExists(yieldOutcome.yield_amount, 'Yield outcome yield_amount');
      const yieldAmount = numericValue(yieldOutcome.yield_amount);
      if (yieldAmount === null) {
        throw new Error(`Invalid yield_amount for yield outcome id ${yieldOutcome.id}`);
      }
      const query = `INSERT INTO yield_outcomes (id, crop_cycle_id, yield_amount, unit, harvest_date, notes)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING`;
      await pool.query(query, [yieldOutcome.id || null, yieldOutcome.crop_cycle_id, yieldAmount, yieldOutcome.unit || null, yieldOutcome.harvest_date || null, yieldOutcome.notes || null]);
    }

    const recommendations = Array.isArray(data.recommendations) ? data.recommendations : [];
    for (const recommendation of recommendations) {
      validateRecordExists(recommendation.recommendation_text, 'Recommendation text');
      const query = `INSERT INTO recommendations (id, farmer_id, farm_id, crop_cycle_id, recommendation_text, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING`;
      await pool.query(query, [recommendation.id || null, recommendation.farmer_id || null, recommendation.farm_id || null, recommendation.crop_cycle_id || null, recommendation.recommendation_text, recommendation.created_at || null]);
    }

    await updateSerialSequences();
    await pool.query('COMMIT');
    console.log('Seed completed successfully');
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Seed failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed().catch((error) => {
  console.error('Unexpected seed error:', error);
  process.exit(1);
});
