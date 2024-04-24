const express = require("express");
const { handleUserSignup , handleUserLogin ,logout} = require("../controller/user");
const { handlePayment,handleGetPayment} = require("../controller/payment");
const router = express();

router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
router.post("/logout", logout);
router.post("/payment/addPaymentDetails", handlePayment);
router.get("/payment/getPaymentDetails", handleGetPayment);

module.exports = router;
