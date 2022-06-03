const router = require('express').Router()
const mysql = require("mysql");
const generateRegisterModel = require("../Models/RegisterModel")
const db = generateRegisterModel()
const ValidateAccessToken = require('../Controller/ValidateAccessToken')

router.post("/", [ValidateAccessToken], async (req,res,next) => {
       try{
            const email = req.body.email;

            await db.getConnection( async (err,connection)=> {
        
                if (err) throw (err)

                const sqlSearch = "SELECT * FROM register_table WHERE register_email = ?"
                const search_query = mysql.format(sqlSearch,[email]);
        
                await connection.query (search_query, async (err, result) => {
                    
                    connection.release()

                    if (err) throw (err)

                    if(result.length == 0){
                        console.log("-------> User does not exist")
                        res.status(404).send({"Status":"User does not exist", "Details": err});
                    }

                    const userEmail = result[0].register_email
                    const userMobileNumber = result[0].register_mobile_number
                    const userName = result[0].register_name
                    const data = {userName: userName, userEmail: userEmail, userMobileNumber: userMobileNumber}

                    res.status(200).send(data)
                })

            })
       }catch (err) {
             res.status(404).send({"Status":"Failure", "Details": err})
       }
})

module.exports = router
