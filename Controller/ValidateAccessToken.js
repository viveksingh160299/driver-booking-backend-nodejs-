require("dotenv").config()
const jwt= require("jsonwebtoken")

async function ValidateAccessToken (req,res,next) {
    try{

        const authHeader = req.headers["authorization"]
        const access_token = authHeader.split(" ")[1]

        if(access_token == null)
            res.status(400).send("AccessToken not present")

        jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        
            if (err) 
                res.status(400).send("Invalid AccessToken")
            else{
                next()
            }    
        })

    }catch (err) {
        res.status(400).send({"Status":"Failure", "Details": err})
    }
}

module.exports = ValidateAccessToken