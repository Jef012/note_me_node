const express = require("express");
const { handleUserSignup , handleUserLogin ,logout} = require("../controller/user");
const router = express();

router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
router.post("/logout", logout);

module.exports = router;
