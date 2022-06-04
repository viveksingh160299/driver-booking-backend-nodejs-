require("dotenv").config()

const cors = require('cors')
const express = require("express");
const app = express()
const port = process.env.PORT
app.use(express.json())
app.use(cors())

/*---------------------otp_register---------------------------*/

const otp = require('./routes/otp');
app.use('/otp', otp);

/*---------------------register---------------------------*/

const register = require('./routes/register');
app.use('/register', register);

/*---------------------login-----------------------------*/

const login = require('./routes/login');
app.use('/login', login);

/*--------------------Dashboard--------------------------*/

const dashboard = require('./routes/dashboard');
app.use('/dashboard', dashboard);

/*----------------starting server------------------------*/

app.listen(port,
    () => console.log(`Server Started on port ${port}...`))