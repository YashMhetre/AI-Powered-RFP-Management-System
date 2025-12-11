import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import rfpRoutes from './routes/rfpRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import proposalRoutes from './routes/proposalRoutes.js';
import { startEmailPolling } from './services/emailReceiver.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check - BEFORE routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    routes: {
      rfps: '/api/rfps',
      vendors: '/api/vendors',
      proposals: '/api/proposals'
    }
  });
});

// Routes - MUST have /api prefix
app.use('/api/rfps', rfpRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/proposals', proposalRoutes);

// Test route to verify API is working
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API is working!',
    endpoints: {
      rfps: '/api/rfps',
      vendors: '/api/vendors',
      proposals: '/api/proposals',
      health: '/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler - MUST be last
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 API Base: http://localhost:${PORT}/api`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  console.log('='.repeat(50));
  console.log('Available routes:');
  console.log(`  GET  /api/rfps`);
  console.log(`  GET  /api/vendors`);
  console.log(`  GET  /api/proposals/rfp/:rfpId`);
  console.log('='.repeat(50));

  // Email Polling (IMAP)
const pollIntervalMs = parseInt(process.env.EMAIL_POLL_INTERVAL || 120000);

console.log(`📬 Email polling enabled (every ${pollIntervalMs / 1000}s)`);

// Run immediately when server starts
startEmailPolling().catch(err => {
  console.error("Email polling startup error:", err.message);
});

// Run repeatedly at interval
setInterval(() => {
  console.log("⏰ Checking for new proposal emails...");
  startEmailPolling().catch(err => {
    console.error("Email polling error:", err.message);
  });
}, pollIntervalMs);

});

export default app;