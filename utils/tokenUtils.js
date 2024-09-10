import jwt from 'jsonwebtoken';
import redisClient from '../config/redisClient.js';

// Helper function to handle Redis operations with better error handling
const setRedisValue = async (key, value, expiry) => {
    try {
        await redisClient.set(key, value, 'EX', expiry);
    } catch (error) {
        console.error('Redis set error:', error);
        throw new Error('Failed to set Redis value');
    }
};

const getRedisValue = async (key) => {
    try {
        return await redisClient.get(key);
    } catch (error) {
        console.error('Redis get error:', error);
        throw new Error('Failed to get Redis value');
    }
};

// Generate JWT Token
export const generateToken = (userId, email) => 
    jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

// Blacklist Token
export const blacklistToken = async (token) => {
    const { exp } = jwt.decode(token) || {};

    if (!exp) return; // Safeguard for invalid tokens

    const expireTimeInSeconds = exp - Math.floor(Date.now() / 1000);
    if (expireTimeInSeconds > 0) {
        await setRedisValue(token, 'blacklisted', expireTimeInSeconds);
    }
};

// Check if token is blacklisted
export const isTokenBlacklisted = async (token) => {
    const result = await getRedisValue(token);
    return result === 'blacklisted';
};
