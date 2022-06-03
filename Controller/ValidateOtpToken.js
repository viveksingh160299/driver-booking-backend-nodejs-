require("dotenv").config()
const jwt= require("jsonwebtoken")
const mysql = require("mysql");
const generateRegisterModel = require("../Models/RegisterModel")
const db = generateRegisterModel()

async function ValidateOtpToken (req,res,next) {
    
    try{
        const authHeader = req.headers["authorization"]
        const otp_token = authHeader.split(" ")[1]

        if(otp_token == null)
            res.status(400).send("OtpToken not present")

        const otp = req.body.otp;
        const mobile_number = req.body.mobile_number;
           
        await db.getConnection( async (err,connection)=> {
        
            if(err)  throw (err)

            console.log("DB connected successfully: " + connection.threadId)
    
            const sqlSearch = "SELECT * FROM otp_table WHERE mobile_number = ?"
            const search_query = mysql.format(sqlSearch,[mobile_number]);

            await connection.query (search_query, async (err, result) => {
                if (err) throw (err)

                connection.release()
                console.log("-------> Search Results")
                console.log(result.length)

                if(result.length == 0){
                    console.log("------> OTP does not exists")
                    res.status(409).send({"Status":"OTP does not exists", "Details": err});
                }

                else{
                    if( !((result[0].otp === otp) && (result[0].otp_token === otp_token)) ){
                        console.log("------> Either OTP or OtpToken does not match")
                        res.status(409).send({"Status":"Either OTP or OtpToken is Invalid", "Details": err});
                    }

                    else{
                        jwt.verify(otp_token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        
                            if (err) 
                                res.status(400).send("Invalid OtpToken")
                            else{
                                next()
                            }    
                        })
                    }
                }

            })

        })

        
    }catch(err){
        res.status(400).send({"Status":"Failure", "Details": err})
    }
}


module.exports = ValidateOtpToken