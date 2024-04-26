const mongoose = require("mongoose");

const userSchema = mongoose.Schema({

    mobile:{
        type : String,
        require : true
    },
    email:{
        type : String,
        require : true,
        unique : true
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
