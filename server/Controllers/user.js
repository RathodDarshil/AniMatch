const async = require("async");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { PrismaClient } = require("@prisma/client");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const prisma = new PrismaClient();

exports.loginUser = (req, res) => {
    try {
        const token = req.body.token;
        client
            .verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            })
            .then((response) => {
                prisma.user
                    .findUnique({
                        where: {
                            email: response.payload.email,
                        },
                    })
                    .then((user) => {
                        if (user) {
                            const token = jwt.sign(
                                {
                                    id: user.id,
                                    email: user.email,
                                    firstname: user.given_name,
                                    lastname: user.family_name,
                                    photo: user.picture,
                                    username: user.username,
                                },
                                process.env.JWT_SECRET,
                                { expiresIn: "7days" }
                            );
                            return res.status(200).json({
                                code: 200,
                                msg: "Login Success",
                                data: {
                                    token,
                                    user_info: user,
                                },
                            });
                        } else {
                            prisma.user
                                .create({
                                    data: {
                                        email: response.payload.email,
                                        firstname: response.payload.given_name,
                                        lastname: response.payload.family_name,
                                        photo: response.payload.picture,
                                    },
                                })
                                .then((user) => {
                                    const token = jwt.sign(
                                        {
                                            id: user.id.toString(),
                                            email: user.email,
                                            firstname: user.given_name,
                                            lastname: user.family_name,
                                            photo: user.picture,
                                            username: user.username,
                                        },
                                        process.env.JWT_SECRET,
                                        { expiresIn: "7days" }
                                    );
                                    return res.status(200).json({
                                        code: 200,
                                        msg: "Login Success",
                                        data: {
                                            token,
                                            user_info: user,
                                        },
                                    });
                                });
                        }
                    })
                    .catch((err) => {
                        res.status(500).send({ code: 500, msg: "Internal server error" });
                    });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).send({ code: 500, msg: "Google Auth Failed" });
            });
    } catch (e) {
        return res.status(500).json({ code: 500, msg: "Internal server error" });
    }
};

exports.search = (req, res) => {
    try {
        const username = req.query.username;
        prisma.user
            .findUnique({
                where: {
                    username,
                },
            })
            .then((user) => {
                if (user) {
                    res.status(200).json({
                        code: 200,
                        msg: "User found",
                        data: user,
                    });
                } else {
                    res.status(404).send({ code: 500, msg: "User not found" });
                }
            })
            .catch((err) => {
                res.status(500).send({ code: 500, msg: "Internal server error" });
            });
    } catch (e) {
        return res.status(500).json({ code: 500, msg: "Internal server error" });
    }
};
