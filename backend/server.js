import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import farmersRouter from './routes/farmers.js';
import farmsRouter from './routes/farms.js';
import soilTestsRouter from './routes/soilTests.js';
import cropCyclesRouter from './routes/cropCycles.js';
import fertilizerApplicationsRouter from './routes/fertilizerApplications.js';
import yieldOutcomesRouter from './routes/yieldOutcomes.js';
import recommendationsRouter from './routes/recommendations.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/farmers', farmersRouter);
app.use('/farms', farmsRouter);
app.use('/soil-tests', soilTestsRouter);
app.use('/crop-cycles', cropCyclesRouter);
app.use('/fertilizer-applications', fertilizerApplicationsRouter);
app.use('/yield-outcomes', yieldOutcomesRouter);
app.use('/recommendations', recommendationsRouter);

app.get('/', (req, res) => {
  res.json({ success: true, data: 'Mchanga Afya Backend is running' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Mchanga Afya Backend listening on port ${port}`);
});
