"use strict"


const mongoose = require("mongoose")
require("dotenv").config()


mongoose.connect(process.env.DB_URI)
        .then(()=>console.log("* DB Connected * "))
        .catch((err)=>console.log("! DB Not Connected !",err))
