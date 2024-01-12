const User = require("../models/user");
const metaMessage = require("../index");
const { v4: uuidv4 } = require('uuid');
const {setUser} = require("../service/auth");

//SignUp
async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;

    try {
        // Create a new user
        const newUser = await User.create({
            name, email, password
        });

        const response = {
            meta: {
                status: "true",
                statusCode: res.statusCode,
                message: res.statusCode
            },
            values: newUser
        };

        return res.json(response);
    } catch (error) {
        console.error(`handleUserSignup error: ${error}`);
        const response = {
            meta: {
                status: "false",
                statusCode: 500,
                message:res.statusCode
            },
            values: "Error during user signup"
        };

        return res.status(500).json(response);
    }
}

//Login
async function handleUserLogin(req, res) {
    const {email, password } = req.body;

    try {
        const user = await User.findOne({
         email, password
        }).maxTimeMS(20000);

       const token = setUser(user);
       console.log(" Token :: ",token);
        await User.findOneAndUpdate({email},{token : token},{new : true}).maxTimeMS(20000);
        const response = {
            meta: {
                status: "true",
                statusCode: res.statusCode,
                message: res.statusCode
            },
            values: token,
        };

        console.log("User set:", user);
        return res.json(response);
    } catch (error) {
        console.error(`handleUserLogin error: ${error}`);
        const response = {
            meta: {
                status: "false",
                statusCode: 500,
                message: res.statusCode
            },
            values: "Error during user Login"
        };

        return res.status(500).json(response);
    }
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
};
