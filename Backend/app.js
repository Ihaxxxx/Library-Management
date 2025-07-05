const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const path = require('path')
const expressSession = require('express-session')
const flash = require("connect-flash")
var logger = require('morgan');
const cors = require('cors')
const adminRouter = require('./routers/adminRouter')
const bookRouter = require('./routers/bookRouter')
const userRouter = require('./routers/userRouter')
const mysql = require('mysql2/promise');
const fs = require('fs');


require('dotenv').config();

app.use(logger('dev'));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
)



app.use("/book", bookRouter)
// app.use("/admin",adminRouter)
app.use("/user", userRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));