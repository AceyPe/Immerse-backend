import express from 'express';
import { createNewSession, getSessionDataBySessionId, getSessionDataByTherapistId } from '../controllers/sessionController.js';

const router = express.Router();

router.post('/sessions', createNewSession);

// Get session info by ID
router.get('/sessions/:id', getSessionDataBySessionId);

// GET sessions related to therapistId
router.get('/sessions/therapist/:id', getSessionDataByTherapistId);

export default router;
