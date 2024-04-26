const { getUser } = require("../service/auth");


async function restrictToLoggedinUserOnly(req, res, next) {
    const userUid = req.headers.authorization;
    console.log("UserUid :", userUid);

    if (!userUid) {
        const response = {
            meta: {
                status: "true",
                statusCode: res.statusCode,
                message: res.statusCode
            },
            values: "Unauthorized1"
        };
        return res.json(response);
    }

    const user = getUser(userUid);
     console.log("user :", user);

    if (!user) {
        const response = {
            meta: {
                status: "true",
                statusCode: res.statusCode,
                message: res.statusCode
            },
            values: "Unauthorized2"
        };
        return res.json(response);
    }

    req.user = user;
    next();
}

module.exports = {
    restrictToLoggedinUserOnly,
};
