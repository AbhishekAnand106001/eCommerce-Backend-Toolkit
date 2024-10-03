import jwt from "jsonwebtoken";
import User from "../models/User.js";
import expressAsyncHandler from "express-async-handler";

const JWT_SECRET = "X7kD$8h5l1T@cP9rT2vF!yE4zQ9jG7dS";

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

export const isAdmin = (req, res, next) => {
    // Assuming user information is available in req.user from previous authentication middleware
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};

export const protect = expressAsyncHandler(async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
        req.user = await User.findById(decoded.id).select('-password'); // Attach user to request
        next();
      } catch (error) {
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    }
  
    if (!token) {
      res.status(401);
      throw new Error('Not authorized, no token');
    }
  });

  export const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403);
      throw new Error('Not authorized as admin');
    }
  };