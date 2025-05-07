import express from 'express';
import { getSensorData, postSensorData } from '../controllers/sensorsController.js';

const router = express.Router();

router.get('/sensors', getSensorData); // Optional: filter with ?sessionId=
router.post('/sensors/:therapistId', postSensorData);

export default router;
