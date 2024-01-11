const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({

    userId:{
        type : String,
        require : true
    },
    title:{
        type : String,
        require :true,
    },
    content:{
        type : String,
    },
    date : {
        type : Date,
        default : Date.now
    }
},{versionKey :false});

 module.exports = mongoose.model("note",noteSchema);
