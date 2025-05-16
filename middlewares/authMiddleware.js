import { verifyEncryptedToken } from "../utils/jwtUtils.js";
import { JWT_CONFIG } from "../config/jwtConfig.js";

export const requireAuth = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).end();
    }
    try {
        const payload = await verifyEncryptedToken(token, JWT_CONFIG.publicKey);
        req.user = { id: payload.id, role: payload.role, roleId: payload.roleId };
        console.log(req.user);
        next();
    } catch (err) {
        return res.status(401).end();
    }
}