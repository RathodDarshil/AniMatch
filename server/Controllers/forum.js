const async = require("async");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
// const { PrismaClient } = require("@prisma/client");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const astraClient = require("../connect-database");

// const prisma = new PrismaClient();

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

        let query = `insert into hacktoon.forum( id, user_fk, comment,reply_to, mal_id )
                        values( uuid(), ${user_fk}, '${comment}', ${reply_to}, ${mal_id})`;

        astraClient
            .execute(query)
            .then((result) => {
                res.status(200).json({
                    code: 200,
                    data: "Comment successfully added",
                });
            })
            .catch((err) => {
                console.log(err);

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

        let query = `select * from hacktoon.forum where mal_id = ${mal_id} allow filtering`;

        const main_thread = await astraClient.execute(query);

        if (main_thread.rows.length > 0) {
            let promise = new Promise(function (resolve, reject) {
                main_thread.rows.forEach((thread, index) => {
                    let query = `select * from hacktoon.User where id = ${thread.user_fk}`;
                    astraClient
                        .execute(query)
                        .then((results) => {
                            thread.user_data = results.rows[0];
                        })
                        .catch((e) => {
                            console.log(e);
                        });
                    if (index === main_thread.length - 1) {
                        res.status(200).json({
                            code: 200,
                            data: main_thread,
                        });
                    }
                });
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
