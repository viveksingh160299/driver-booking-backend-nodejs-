const router = require('express').Router()
const bcrypt = require('bcrypt')
const mysql = require("mysql");
const generateAccessToken = require("../Controller/generateAccessToken")
const generateRegisterModel = require("../Models/RegisterModel")
const db = generateRegisterModel()

router.post("/", async (req,res,next) => {
   
    try{
        const email = req.body.email;
        const password = req.body.password;

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
                else{
                    const hashedPassword = result[0].register_password;
                    
                    if(await bcrypt.compare(password, hashedPassword)){
                        console.log("-----> Login Successfull")
                        const token = generateAccessToken({email : email})
                        console.log(token)
                    
                        res.send({accessToken : token})
                    }
                    else{
                        console.log("-----> Password Incorrect")
                        res.status(402).send(`Password Incorrect!`)
                    }
                }

            })
        
        })
    }catch(err){
        res.status(400).send({"Status":"Failure", "Details": err})
    }

})

module.exports = router