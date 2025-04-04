import type { Request, Response } from 'express';
import express from 'express';
const router = express.Router();

import apiRoutes from './api/index.js';

router.use('/api', apiRoutes);

// ✅ Let server.ts handle React app, fallback here shows error only if something is broken
router.use((_req: Request, res: Response) => {
  res.status(404).send('Wrong page!');
});

export default router;
