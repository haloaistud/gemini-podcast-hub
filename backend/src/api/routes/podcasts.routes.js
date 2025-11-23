import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { authenticate } from '../../middleware/auth.js';
import { prisma } from '../../core/db/prisma.js';
import { AIProcessingPipeline, TranscriptionService } from '../../core/ai/ai-service.js';
const router = express.Router();

// ... (full routes code here, compressed or expanded as needed) ...

export default router;
