const mysql = require("mysql");
const generateRegisterModel = require("../Models/RegisterModel")
const db = generateRegisterModel()

async function deleteExpiredOtp (req,res,next) {
    try{

        await db.getConnection( async (err,connection)=> {

            if(err)  throw (err)

            console.log("DB connected successfully: " + connection.threadId)

            const sqlDelete = "DELETE FROM otp_table WHERE expiresAt < ?"
            const now = Math.floor((new Date().getTime())/1000)
            const delete_query = mysql.format(sqlDelete,[now]);

            await connection.query (delete_query, (err, result) => {
                if (err) throw (err)

                console.log("-------> Expired OTP deleted from otp_table")
                console.log(result)
            })

            connection.release()
        })
    }finally{
        next()
    }
}

module.exports = deleteExpiredOtp