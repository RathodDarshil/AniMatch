const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const astraClient = require("../connect-database");

const authUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        let query = `select * from hacktoon.User where id = ${decoded.id}`;

        astraClient
            .execute(query)
            .then((result) => {
                if (result) {
                    req.user = result.rows[0];
                    req.token = token;
                    next();
                } else {
                    return res.status(401).send("Not authorized");
                }
            })
            .catch((err) => {
                return res.status(401).send("Not authorized");
            });
    } catch (e) {
        return res.status(401).send("Not authorized");
    }
};

module.exports = authUser;
