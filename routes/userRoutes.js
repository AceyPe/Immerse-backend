import express from 'express';
import { deleteUserById, getTherapistById,getPatientById, getPatientAndUserEmailById, getPatientsByTherapistId, getTherapists, getUserById, getUsers, getPatients, getParentById } from '../controllers/userController.js';

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/therapists", getTherapists);
router.get("/users/therapist/:id", getTherapistById);
router.get("/users/patient/:id", getPatientById);
router.get("/users/parent/:id", getParentById);
router.get("/users/patient-user/:id", getPatientAndUserEmailById)
router.get("/users/patients", getPatients);
router.get("/users/patients/:therapistId", getPatientsByTherapistId);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUserById);

export default router;