import express from 'express';
import { deleteUserById, getTherapistById,getPatientById, getPatientsByTherapistId, getTherapists, getUserById, getUsers } from '../controllers/userController.js';

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/therapists", getTherapists);
router.get("/users/therapist/:id", getTherapistById);
router.get("/users/patient/:id", getPatientById);
router.get("/users/:therapistId/patients", getPatientsByTherapistId)
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUserById);

export default router;