const blacklistedTokens = new Set();

export const blacklistToken = (token) => {
    blacklistedTokens.add(token);
};

export const isTokenBlacklisted = (token) => {
    return blacklistedTokens.has(token);
};

export const authenticateTokenBlacklist = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token || isTokenBlacklisted(token)) {
        return res.status(403).json({ message: 'Forbidden: Token is blacklisted' });
    }

    next();
};
