import User from '../models/User.js';
import redisClient from '../config/redisClient.js';
import bcrypt from 'bcrypt';

// Helper function to get user from database
const getUserFromDB = async (userId) => {
    const user = await User.findById(userId).select('-password');
    return user;
};

// GET User Profile
export const getUserProfile = async (req, res) => {
    const userId = req.user._id;
    const cacheKey = `user:${userId}`;

    try {
        // Check Redis cache for user profile
        const cachedUser = await redisClient.get(cacheKey);

        if (cachedUser) {
            return res.status(200).json({
                message: 'Profile from cache',
                user: JSON.parse(cachedUser),
            });
        }

        // If not in cache, fetch from database
        const user = await getUserFromDB(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Cache the user profile
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(user));

        res.status(200).json({
            message: 'Profile from DB',
            user,
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
    const { name, email, password } = req.body;
    const userId = req.user._id;

    try {
        const updatedFields = { name, email };

        // If password is provided, hash it before saving
        if (password) {
            updatedFields.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updatedFields,
            { new: true, runValidators: true } // Ensure updated fields are validated
        );

        // If user not found
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Invalidate the cache for the updated user
        await redisClient.del(`user:${userId}`);

        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
