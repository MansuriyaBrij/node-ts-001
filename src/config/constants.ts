// src/config/globals.ts
import { fileURLToPath } from 'url';
import path from 'path';

// Recreate __dirname and __filename in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root (adjust if needed)
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

// Global uploads directory
export const UPLOAD_DIR = path.join(PROJECT_ROOT, 'uploads');
export const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');

export { __filename, __dirname, PROJECT_ROOT };
