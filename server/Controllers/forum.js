const async = require("async");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { PrismaClient } = require("@prisma/client");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const prisma = new PrismaClient();

exports.addComment = (req, res) => {
    try {
        const user_fk = req.user.id;
        const comment = req.body.comment;
        const mal_id = req.body.mal_id;
        let reply_to;

        if (req.body.reply_to) {
            reply_to = req.body?.reply_to;
        } else {
            reply_to = null;
        }

        prisma.forum
            .create({
                data: {
                    user_fk,
                    comment,
                    reply_to,
                    mal_id,
                },
            })
            .then((result) => {
                res.status(200).json({
                    code: 200,
                    data: "Comment successfully added",
                });
            })
            .catch((err) => {
                return res.status(500).json({ code: 500, msg: "Internal server error" });
            });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ code: 500, msg: "Internal server error" });
    }
};

exports.mainThread = async (req, res) => {
    try {
        const mal_id = parseInt(req.query.mal_id);
        const main_thread =
            await prisma.$queryRaw`select * from forum f left join "User" u on f.user_fk = u.id where f.mal_id = ${mal_id} and f.reply_to is null`;
        if (main_thread) {
            res.status(200).json({
                code: 200,
                data: main_thread,
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ code: 500, msg: "Internal server error" });
    }
};

exports.replys = async (req, res) => {
    try {
        const mal_id = parseInt(req.query.mal_id);
        const reply_to =
            await prisma.$queryRaw`select * from forum f left join "User" u on f.user_fk = u.id where f.reply_to = ${mal_id}`;
        if (reply_to) {
            res.status(200).json({
                code: 200,
                data: reply_to,
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ code: 500, msg: "Internal server error" });
    }
};

exports.like = (req, res) => {
    try {
        const id = parseInt(req.body.id);
        prisma.forum
            .findUnique({
                where: {
                    id,
                },
            })
            .then((result) => {
                if (result) {
                    prisma.forum
                        .update({
                            where: {
                                id,
                            },
                            data: {
                                likes: result.likes + 1,
                            },
                        })
                        .then((result) => {
                            res.status(200).json({
                                code: 200,
                                msg: "Liked",
                                data: {
                                    total_likes: result.likes,
                                },
                            });
                        })
                        .catch((err) => {
                            return res.status(500).json({ code: 500, msg: "Internal server error" });
                        });
                }
            });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ code: 500, msg: "Internal server error" });
    }
};
