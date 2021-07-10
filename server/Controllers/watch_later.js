const async = require("async");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { PrismaClient } = require("@prisma/client");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const prisma = new PrismaClient();

exports.all = (req, res) => {
    try {
        const user_id = req.user.id;
        prisma.watch_later
            .findMany({
                where: {
                    user_fk: user_id,
                    deleted: null,
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
        const mal_id = req.body.mal_id;
        const user_id = req.user.id;
        prisma.watch_later
            .findFirst({
                where: {
                    user_fk: user_id,
                    mal_id,
                },
            })
            .then((result) => {
                if (!result) {
                    prisma.watch_later
                        .create({
                            data: {
                                user_fk: user_id,
                                mal_id,
                            },
                        })
                        .then((response) => {
                            res.status(200).json({
                                code: 200,
                                msg: "Watch later added successfully",
                            });
                        })
                        .catch((err) => {
                            console.log(err);
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
exports.delete = (req, res) => {
    try {
        const id = req.body.id;
        prisma.watch_later
            .findFirst({
                where: {
                    id,
                },
            })
            .then((result) => {
                if (result) {
                    prisma.watch_later
                        .update({
                            where: {
                                id,
                            },
                            data: {
                                deleted: true,
                            },
                        })
                        .then((response) => {
                            res.status(200).json({
                                code: 200,
                                msg: "Deleted Successfully",
                            });
                        })
                        .catch((err) => {
                            return res.status(500).json({ code: 500, msg: "Error while deleting" });
                        });
                }
            })
            .catch((err) => {
                return res.status(500).json({ code: 500, msg: "Error while fetching id" });
            });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ code: 500, msg: "Internal server error" });
    }
};
