const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
    rate:{
        type : Number,
        require : true
    },
    title:{
        type : String,
        require :true,
    },
    details:{
        type : String,
        require :true,
    },
    date : {
        type : Date,
        default : Date.now
    }
},{versionKey :false});

 module.exports = mongoose.model("payment",paymentSchema);
