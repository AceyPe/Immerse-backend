import express from 'express';
import { deleteUserById, getTherapists, getUserById, getUsers } from '../controllers/userController.js';

const router = express.Router();

router.get("/users", getUsers);
router.get("/therapists", getTherapists);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUserById);

export default router;