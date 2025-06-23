import express from 'express';
import { createNewSession, getSessionsDataByPatientId, getSessionDataBySessionId, getSessionsDataByTherapistId, getSessions, startSession, endSession } from '../controllers/sessionController.js';

const router = express.Router();

router.post('/sessions', createNewSession);

router.get('/sessions', getSessions);

router.post('/sessions/start/:therapistId', startSession);

router.post('/sessions/end/:therapistId', endSession);

// Get session info by ID
router.get('/sessions/:id', getSessionDataBySessionId);

// GET sessions related to therapistId
router.get('/sessions/therapist/:id', getSessionsDataByTherapistId);

// GET sessions related to patientId
router.get('/sessions/patient/:id', getSessionsDataByPatientId)

export default router;
