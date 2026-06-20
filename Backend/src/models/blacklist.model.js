const mongoose = require('mongoose')


const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [ true, "token is required to be added in blacklist" ]
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '7d' // Automatically delete after 7 days
    }
}, {
    timestamps: true
})

const tokenBlacklistModel = mongoose.model("blacklistTokens", blacklistTokenSchema)


module.exports = tokenBlacklistModel