const User = require("../models/user");
const metaMessage = require("../index");
const { v4: uuidv4 } = require('uuid');
const {setUser} = require("../service/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();


//SignUp
async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;
    try {
        // Create a new user
        const newUser = await User.create({
            name, email, password
        });
        const token = setUser(newUser);
        console.log(" Token :: ",token);
        await User.findOneAndUpdate({email},{token : token},{new : true});

        const response = {
            meta: {
                status: "true",
                statusCode: res.statusCode,
                message: "User signedIn successfully"
            },
            values: token,
        };

        return res.json(response);
    } catch (error) {
        console.error(`handleUserSignup error: ${error}`);
        const response = {
            meta: {
                status: "false",
                statusCode: 500,
                message: "Something went wrong"
            },
            values: ""
        };

        return res.json(response);
    }
}

//Login
async function handleUserLogin(req, res) {
    const {email, password } = req.body;

    try {
        const user = await User.findOne({
         email, password
        });

       const token = setUser(user);
       console.log(" Token :: ",token);
      const data = await User.findOneAndUpdate({email},{token : token},{new : true});

        const response = {
            meta: {
                status: "true",
                statusCode: res.statusCode,
                message: res.statusCode
            },
            values: data
        };

        console.log("User set:", user);
        return res.json(response);
    } catch (error) {
        console.error(`handleUserLogin error: ${error}`);
        const response = {
            meta: {
                status: "false",
                statusCode: res.statusCode,
                message: "Something went wrong"
            },
            values: ""
        };

        return res.status(500).json(response);
    }
}

//Logout
async function logout(req, res) {
    const authToken = req.headers.authorization;
    try {
        const token = authToken.slice(7);
        if(!token){
            return res.status(401).json({message: "Authorization token missing"})
        }else{
            const decoder = jwt.verify(token,process.env.SECRET_KEY);
            console.log("Decoder >>",decoder);
            const email = decoder.email;
            const user = await User.findOne({email});

        await User.findOneAndUpdate({email},{token : ""},{new : true});
        const response = {
          meta: {
            status: "true",
            statusCode: res.statusCode,
            message: "Logout successful",
          },
          values: token,
        };

        res.json(response);
    }
    } catch (error) {
        console.error(`UserLogout error: ${error}`);
        const response = {
            meta: {
                status: "false",
                statusCode: 500,
                message: "Error during user logout"
            },
            values: ""
        };
        return res.status(500).json(response);
    }

  }





module.exports = {
    handleUserSignup,
    handleUserLogin,
    logout
};
