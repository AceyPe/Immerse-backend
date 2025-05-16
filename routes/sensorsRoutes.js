import express from 'express';
import { getSensorData, postSensorData } from '../controllers/sensorsController.js';

const router = express.Router();

router.get('/sensors', getSensorData);
router.post('/sensors/:therapistId', postSensorData);

export default router;
