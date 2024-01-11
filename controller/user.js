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
        });
        const sessionId = uuidv4();
        setUser(sessionId,user);
        await User.findOneAndUpdate({email},{token : sessionId},{new : true});
        const response = {
            meta: {
                status: "true",
                statusCode: res.statusCode,
                message: res.statusCode
            },
            values: {
                userDetails : user,
                token: sessionId
            }
        };
        return res.json(response);
    } catch (error) {
        console.error(`handleUserSignup error: ${error}`);
        const response = {
            meta: {
                status: "false",
                statusCode: 500,
                message: res.statusCode
            },
            values: "Error during user signup"
        };

        return res.status(500).json(response);
    }
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
};
