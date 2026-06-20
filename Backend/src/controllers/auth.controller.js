const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")
const asyncHandler = require("../utils/asyncHandler")
const AppError = require("../utils/appError")

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
const registerUserController = asyncHandler(async (req, res, next) => {

    const { username, email, password } = req.body

    const isUserAlreadyExists = await userModel.findOne({
        $or: [ { username }, { email } ]
    })

    if (isUserAlreadyExists) {
        return next(new AppError("Account already exists with this email address or username", 400))
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })

    res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

})


/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
const loginUserController = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return next(new AppError("Invalid email or password", 401))
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return next(new AppError("Invalid email or password", 401))
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })
    res.status(200).json({
        message: "User loggedIn successfully.",
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
})


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
const logoutUserController = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token

    if (token) {
        await tokenBlacklistModel.create({ token })
    }

    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })

    res.status(200).json({
        message: "User logged out successfully"
    })
})

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
const getMeController = asyncHandler(async (req, res, next) => {

    const user = await userModel.findById(req.user.id)

    if (!user) {
        return next(new AppError("User not found", 404))
    }

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

})



module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}