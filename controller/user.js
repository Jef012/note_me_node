const User = require("../models/user");
const metaMessage = require("../index");
const { v4: uuidv4 } = require('uuid');
const {setUser} = require("../service/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");


//SignUp
async function handleUserSignup(req, res) {
    const { mobile, email, password } = req.body;
    try {

    //   const existingUser = await User.findOne({
    //     $or: [{ email }, { mobile }],
    //   });

    //   if (existingUser) {
    //     return res.status(400).json({
    //       meta: {
    //         status: "false",
    //         statusCode: 400,
    //         message: "Email or mobile number already in use",
    //       },
    //       values: "",
    //     });
    //   }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        mobile,
        email,
        password: hashedPassword,
      });
      const token = setUser(newUser);
      return res.status(201).json({
        meta: {
          status: "true",
          statusCode: 200,
          message: "User signed up successfully",
        },
        values: {
            mobile,email,token
        },
      });
    } catch (error) {
      console.error(`handleUserSignup error: ${error}`);
      return res.status(500).json({
        meta: {
          status: "false",
          statusCode: 500,
          message: "Internal server error",
        },
        values: "",
      });
    }
  }

//Login
async function handleUserLogin(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                meta: {
                    status: "false",
                    statusCode: 404,
                    message: "User not found",
                },
                values: "",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                meta: {
                    status: "false",
                    statusCode: 401,
                    message: "Incorrect password",
                },
                values: "",
            });
        }

        const token = setUser(user);
        await User.findOneAndUpdate({ email }, { token }, { new: true });

        const response = {
            meta: {
                status: "true",
                statusCode: res.statusCode,
                message: "Login successful",
            },
            values: { token, user },
        };

        return res.json(response);
    } catch (error) {
        console.error(`handleUserLogin error: ${error}`);
        return res.status(500).json({
            meta: {
                status: "false",
                statusCode: 500,
                message: "Something went wrong during login",
            },
            values: "",
        });
    }
}


// async function handleUserLogin(req, res) {
//     const {email, password } = req.body;

//     try {
//         const user = await User.findOne({
//          email, password
//         });

//        const token = setUser(user);
//        console.log(" Token :: ",token);
//       const data = await User.findOneAndUpdate({email},{token : token},{new : true});

//         const response = {
//             meta: {
//                 status: "true",
//                 statusCode: res.statusCode,
//                 message: res.statusCode
//             },
//             values: data
//         };

//         console.log("User set:", user);
//         return res.json(response);
//     } catch (error) {
//         console.error(`handleUserLogin error: ${error}`);
//         const response = {
//             meta: {
//                 status: "false",
//                 statusCode: res.statusCode,
//                 message: "Something went wrong"
//             },
//             values: ""
//         };

//         return res.status(500).json(response);
//     }
// }

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
