const async = require("async");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { PrismaClient } = require("@prisma/client");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const prisma = new PrismaClient();

exports.all = (req, res) => {
    try {
        const user_fk = req.user.id;
        const user_friend_fk = req.body.user_id;
        prisma.friends
            .findMany({
                where: {
                    user_fk,
                    user_friend_fk,
                },
            })
            .then((result) => {
                res.status(200).json({
                    code: 200,
                    data: result,
                });
            })
            .catch((err) => {
                return res.status(500).json({ code: 500, msg: "Internal server error" });
            });
    } catch (e) {
        return res.status(500).json({ code: 500, msg: "Internal server error" });
    }
};
exports.add = (req, res) => {
    try {
        const user_friend_fk = req.body.user_id;
        const user_fk = req.user.id;
        prisma.friends
            .findFirst({
                where: {
                    user_fk,
                    user_friend_fk,
                },
            })
            .then((result) => {
                if (!result) {
                    prisma.friends
                        .create({
                            data: {
                                user_fk,
                                user_friend_fk,
                            },
                        })
                        .then((response) => {
                            res.status(200).json({
                                code: 200,
                                msg: "friends added successfully",
                            });
                        })
                        .catch((err) => {
                            res.status(500).send({ code: 500, msg: "Internal server error" });
                        });
                } else {
                    return res.status(403).json({ code: 403, msg: "Already exists" });
                }
            })
            .catch((err) => {
                return res.status(500).json({ code: 500, msg: "Internal server error" });
            });
    } catch (e) {
        return res.status(500).json({ code: 500, msg: "Internal server error" });
    }
};
exports.delete = async (req, res) => {
    try {
        const user_friend_fk = req.body.user_id;
        const user_fk = req.user.id;
        const deletion =
            await prisma.$queryRaw`delete from friends where user_friend_fk = ${user_friend_fk} and user_fk = ${user_fk};`;
        if (deletion) {
            res.status(200).json({
                code: 200,
                msg: "Deleted Successfully",
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ code: 500, msg: "Internal server error" });
    }
};
