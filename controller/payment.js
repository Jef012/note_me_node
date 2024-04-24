const Payment = require("../models/payment");
const metaMessage = require("../index");
const { v4: uuidv4 } = require('uuid');
const {setUser} = require("../service/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();


//Payment
async function handlePayment(req, res) {
    const { rate, title, details } = req.body;

    try {

        const paymentCount = await Payment.countDocuments({});


        if (paymentCount >= 3) {
            const response = {
                meta: {
                    status: "false",
                    statusCode: res.statusCode,
                    message: "Cannot add more than 3 payments",
                },
                values: "",
            };

            return res.status(400).json(response);
        }


        const newPayment = new Payment({
            rate,
            title,
            details,
        });

        await newPayment.save();

        const response = {
            meta: {
                status: "true",
                statusCode: res.statusCode,
                message: "Purchase payment details added successfully",
            },
            values: newPayment,
        };

        return res.json(response);
    } catch (error) {
        console.error(`handlePayment error: ${error}`);
        const response = {
            meta: {
                status: "false",
                statusCode: 500,
                message: "An error occurred while processing the payment",
            },
            values: "",
        };

        return res.status(500).json(response);
    }
}
//get payment details
async function handleGetPayment(req, res) {
    try {
        const paymentDetails = await Payment.find({}).limit(3);
        const response = {
            meta: {
                status: "true",
                statusCode: res.statusCode,
                message: "Payment details retrieved successfully",
            },
            values: paymentDetails,
        };
        return res.json(response);
    } catch (error) {
        console.error(`get purchase payment error: ${error}`);
        const response = {
            meta: {
                status: "false",
                statusCode: 500,
                message: "An error occurred while fetching payment details",
            },
            values: "",
        };
        return res.status(500).json(response);
    }
}



module.exports = {
    handlePayment,
    handleGetPayment
};
