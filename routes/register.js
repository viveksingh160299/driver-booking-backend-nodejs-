const router = require('express').Router()
const bcrypt = require('bcrypt')
const mysql = require("mysql");
const generateRegisterModel = require("../Models/RegisterModel")
const db = generateRegisterModel()
const ValidateOtpToken = require('../Controller/ValidateOtpToken')
const generateAccessToken = require("../Controller/generateAccessToken")
const deleteExpiredOtp = require('../Controller/deleteExpiredOtp')

router.post('/', [deleteExpiredOtp, ValidateOtpToken], async (req,res,next) => {
    
    try{
        const user = req.body.name;
        const mobile_number = req.body.mobile_number;
        const email = req.body.email;
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        

        await db.getConnection( async (err,connection)=> {
        
            if(err)  throw (err)

            console.log("DB connected successfully: " + connection.threadId)
    
            const sqlSearch = "SELECT * FROM register_table WHERE register_email = ?"
            const search_query = mysql.format(sqlSearch,[email]);
            const sqlInsert = "INSERT INTO register_table VALUES (0,?,?,?,?)"
            const insert_query = mysql.format(sqlInsert,[user, mobile_number, email, hashedPassword])

            await connection.query (search_query, async (err, result) => {

                if (err) throw (err)

                console.log("-------> Search Results")
                console.log(result.length)

                if(result.length != 0){
                    console.log("------> User already exists")
                    res.status(409).send({"Status":"User already exists", "Details": err});
                }

                else{
                    await connection.query (insert_query, (err, result) => {
                        
                        if (err) throw (err)

                        console.log("-------> New User Created")
                        console.log(result.insertId)
                        const token = generateAccessToken({email : email})
                        console.log(token)
                        res.status(201).send({"Status":"Success", accessToken : token})
                    })
                }
            })

        })
    }catch(err){
        res.status(400).send({"Status":"Failure", "Details": err})
    }finally{
        connection.release()
    }

})

module.exports = router