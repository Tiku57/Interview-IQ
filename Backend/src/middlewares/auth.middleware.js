const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")



async function authUser(req, res, next) {
    console.log("=== AUTH MIDDLEWARE START ===");
    console.log("Authorization Header:", req.headers.authorization);


    // Accept token from cookie OR Authorization: Bearer <token> header
    let token = req.cookies.token

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
        console.error("AUTH FAILED: Token not provided.");
        return res.status(401).json({
            message: "Token not provided."
        })
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    })

    if (isTokenBlacklisted) {
        console.error("AUTH FAILED: Token is blacklisted.");
        return res.status(401).json({
            message: "token is invalid"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log("Decoded User:", decoded);

        req.user = decoded

        next()

    } catch (err) {
        console.error("AUTH FAILED: JWT verification failed.");
        console.error("JWT Error:", err.message);
        return res.status(401).json({
            message: "Invalid token."
        })
    }
}


module.exports = { authUser }