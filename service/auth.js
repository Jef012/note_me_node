const jwt = require("jsonwebtoken");
const secret = "jefrinjohnson04@gmail.com";

function setUser(user) {
  return jwt.sign({
    "_id": user._id,
    "email": user.email
  },secret);
}

function getUser(token) {
    console.log("TOKEN ::",token);
    if(!token) return null;
    try {
         return jwt.verify(token.replace("Bearer ",""),secret);
    } catch (error) {

        return null;
    }

}

module.exports = {
  setUser,
  getUser,
};
