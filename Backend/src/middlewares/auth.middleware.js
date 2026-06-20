const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");
const AppError = require("../utils/appError");
const logger = require("../utils/logger");

const authUser = async (req, res, next) => {
    try {
        let token = req.cookies.token;

        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return next(new AppError("You are not logged in. Please log in to get access.", 401));
        }

        const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });

        if (isTokenBlacklisted) {
            return next(new AppError("Token is invalid or expired. Please log in again.", 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return next(new AppError("Invalid token. Please log in again.", 401));
        }
        if (err.name === 'TokenExpiredError') {
            return next(new AppError("Your token has expired! Please log in again.", 401));
        }
        next(err);
    }
};

module.exports = { authUser };