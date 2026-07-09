const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const { connectDB } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Backend is running', status: 'ok' });
});

app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'degraded', database: 'disconnected', error: error.message });
  }
});

app.use('/api', authRoutes);
app.use('/', authRoutes);

connectDB().catch((error) => {
  console.warn('Database connection unavailable at startup:', error.message);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
