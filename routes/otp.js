require("dotenv").config()
const router = require('express').Router()
const mysql = require("mysql")
const generateOtpToken = require("../Controller/generateOtpToken")
const otpGenerator = require('otp-generator');
const generateRegisterModel = require("../Models/RegisterModel")
const db = generateRegisterModel()
const TwoFactor = new (require('2factor'))('78f3c622-e2a1-11ec-9c12-0200cd936042')

router.post('/', async (req,res,next) => {

    try{
                         
        const mobile_number = req.body.mobile_number;
        const otp = otpGenerator.generate(6, {alphabets: false, upperCase: false, specialChars: false});
        const otp_token = generateOtpToken({mobile_number: mobile_number})
        const expiresAt = Math.floor((new Date().getTime())/1000)

        const otp_sqlInsert = "INSERT INTO otp_table VALUES (0,?,?,?,?)"
        const otp_insert_query = mysql.format(otp_sqlInsert,[otp, otp_token, mobile_number, expiresAt])

        await db.getConnection( async (err,connection)=> {
            
            if(err)  throw (err)

            console.log("DB connected successfully: " + connection.threadId)
            
            TwoFactor.sendOTP(mobile_number, {otp: otp}).then((sessionId) => {
               
                    console.log(sessionId)

                    connection.query (otp_insert_query, (err, result) => {
                        connection.release()
                
                        if (err) throw (err)

                        console.log("-------> OTP sent to registered mobile number")
                        console.log(result.insertId)
                        res.status(201).send({otp_token: otp_token})
                    })
                }, (err) => {
                    res.status(400).send({"Status":"Failure", "Details": err})
            });

        })

    }catch(err){
        res.status(400).send({"Status":"Failure", "Details": err})
    }

})


module.exports = router