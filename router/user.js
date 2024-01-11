const express = require("express");
const { handleUserSignup , handleUserLogin } = require("../controller/user");
const router = express();

router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);

module.exports = router;
