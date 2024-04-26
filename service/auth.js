const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = "jefrinjohnson04@gmail.com";

function setUser(user) {
  return jwt.sign({
    "_id": user._id,
    "email": user.email,
    "mobile": user.mobile,
  },process.env.SECRET_KEY);
}

function getUser(token) {
    console.log("TOKEN ::",token);
    if(!token) return null;
    try {
         return jwt.verify(token.replace("Bearer ",""),process.env.SECRET_KEY);
    } catch (error) {

        return null;
    }

}

module.exports = {
  setUser,
  getUser,
};
