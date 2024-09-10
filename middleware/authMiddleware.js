import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(decoded.userId).select('-password'); // Exclude the password field
        if (!req.user) {
            return res.status(401).json({ message: "Invalid token" });
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Invalid token" });
    }
};
