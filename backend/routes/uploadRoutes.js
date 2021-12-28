import express, { Router } from 'express';
import { upload } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});

export default router;
