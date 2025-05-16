import express from 'express'
import { getMyData, login, logout, register } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);

// get the data from a json token through cookie
router.get("/me", requireAuth, (req, res) => {
    res.json({ id: req.user.id, role: req.user.role, roleId: req.user.roleId })
});

// get the data from a json token sent in body
router.post("/mydata", getMyData);


export default router;