import express from 'express'
import { login, logout, register } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
router.get("/me", requireAuth, (req, res) => {
    res.json({ id: req.user.id, role: req.user.role })
})


export default router;