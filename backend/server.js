import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== Middleware ====================
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ==================== Static Files ====================
// سرو کردن فایل‌های frontend
app.use(express.static(path.join(ROOT, 'frontend')));
app.use('/games', express.static(path.join(ROOT, 'frontend/public/games')));
app.use('/pages', express.static(path.join(ROOT, 'frontend/public/pages')));

// ==================== Routes ====================
// TODO: اضافه کردن API routes در قدم‌های بعدی

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    name: 'BeranjYar',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ==================== SPA Fallback ====================
app.get('*', (req, res) => {
  // اگر درخواست API بود، 404 برگردان
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  // در غیر این صورت index.html را برگردان
  res.sendFile(path.join(ROOT, 'frontend', 'index.html'));
});

// ==================== Error Handler ====================
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ==================== Start Server ====================
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║   🌾  BeranjYar Server Started  🌾     ║');
  console.log('╠════════════════════════════════════════╣');
  console.log(`║   Local:   http://localhost:${PORT}      ║`);
  console.log(`║   Network: http://0.0.0.0:${PORT}        ║`);
  console.log(`║   Env:     ${process.env.NODE_ENV || 'development'}                 ║`);
  console.log('╚════════════════════════════════════════╝');
  console.log('');
});