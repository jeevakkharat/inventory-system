const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const transferRoutes = require('./routes/transferRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const auditRoutes = require('./routes/auditRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Security & platform middleware (SRS section 5.2)
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use('/api', limiter);

app.get('/health', (req, res) => res.json({ success: true, status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/audit-logs', auditRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
