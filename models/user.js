const mongoose = require("mongoose");

const userSchema = mongoose.Schema({

    name:{
        type : String,
        require : true
    },
    email:{
        type : String,
        require : true,
        unique : false
    },
    password:{
        type : String,
        require : true
    },
    token:{
        type : String,
    }
},{timeStamps : true});

const User = mongoose.model("user",userSchema);
module.exports = User;
