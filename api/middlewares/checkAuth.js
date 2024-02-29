const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" });

async function checkAuth(req, res, next) {
    // Check for Authorization header from client 
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({ message: "Authorization header is missing" });
    }

    // The Authorization header should be in the format "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(403).json({ message: "Authorization header is malformed" });
    }

    const token = parts[1];

    if (!token) {
        req.user = null;
        next();
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports = { checkAuth };
