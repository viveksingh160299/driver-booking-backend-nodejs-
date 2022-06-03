const jwt = require("jsonwebtoken")

function generateOtpToken (mobile_number) {
    return jwt.sign( mobile_number, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "10m" } )
}

module.exports = generateOtpToken