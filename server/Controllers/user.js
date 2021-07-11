const async = require("async");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { PrismaClient } = require("@prisma/client");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const astraClient = require("../connect-database");

exports.loginUser = async (req, res) => {
    try {
        const token = req.body.token;
        client
            .verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            })
            .then(async (response) => {
                let query = `select * from hacktoon.user where email = '${response.payload.email}' allow filtering`;

                astraClient
                    .execute(query)
                    .then((user) => {
                        if (user.rows.length > 0) {
                            const token = jwt.sign(
                                {
                                    id: user.rows[0].id.toString(),
                                    email: user.rows[0].email,
                                    firstname: user.rows[0].given_name,
                                    lastname: user.rows[0].family_name,
                                    photo: user.rows[0].photo,
                                    username: user.rows[0].username,
                                },
                                process.env.JWT_SECRET,
                                { expiresIn: "7days" }
                            );
                            return res.status(200).json({
                                code: 200,
                                msg: "Login Success",
                                data: {
                                    token,
                                    user_info: user.rows[0],
                                },
                            });
                        } else {
                            let query = `insert 
                                            into 
                                        hacktoon.User( id, firstname, lastname, email, photo )
                                            values( uuid(), '${response.payload.given_name}', '${response.payload.family_name}', '${response.payload.email}', '${response.payload.picture}')`;

                            astraClient
                                .execute(query)
                                .then((user) => {
                                    let query = `select * from hacktoon.user where email = '${response.payload.email}' allow filtering`;

                                    astraClient.execute(query).then((user) => {
                                        if (user.rows.length > 0) {
                                            const token = jwt.sign(
                                                {
                                                    id: user.rows[0].id.toString(),
                                                    email: user.rows[0].email,
                                                    firstname: user.rows[0].given_name,
                                                    lastname: user.rows[0].family_name,
                                                    photo: user.rows[0].photo,
                                                    username: user.rows[0].username,
                                                },
                                                process.env.JWT_SECRET,
                                                { expiresIn: "7days" }
                                            );
                                            return res.status(200).json({
                                                code: 200,
                                                msg: "Login Success",
                                                data: {
                                                    token,
                                                    user_info: user.rows[0],
                                                },
                                            });
                                        }
                                    });
                                })

                                .catch(console.log);
                        }
                    })
                    .catch((err) => {
                        res.status(500).send({ code: 500, msg: "Internal server error" });
                    });
            })
            .catch((err) => {
                res.status(500).send({ code: 500, msg: "Google Auth Failed" });
            });
    } catch (e) {
        return res.status(500).json({ code: 500, msg: "Internal server error" });
    }
};

exports.search = (req, res) => {
    try {
        const username = req.query.username;
        let query = `select * from hacktoon.User where username = '${username}' allow filtering`;

        astraClient
            .execute(query)
            .then((user) => {
                if (user) {
                    res.status(200).json({
                        code: 200,
                        msg: "User found",
                        data: user.rows,
                    });
                } else {
                    res.status(404).send({ code: 500, msg: "User not found" });
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(500).send({ code: 500, msg: "Internal server error" });
            });
    } catch (e) {
        return res.status(500).json({ code: 500, msg: "Internal server error" });
    }
};
