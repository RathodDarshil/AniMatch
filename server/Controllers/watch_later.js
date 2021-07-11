const async = require("async");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
// const { PrismaClient } = require("@prisma/client");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const astraClient = require("../connect-database");

// const prisma = new PrismaClient();

exports.all = (req, res) => {
    try {
        const user_id = req.user.id;
        let query = `select * from hacktoon.watch_later where user_fk = ${user_id} and deleted = false  allow filtering`;
        astraClient
            .execute(query)
            .then((result) => {
                res.status(200).json({
                    code: 200,
                    data: result.rows,
                });
            })
            .catch((err) => {
                console.log(err);
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
        let query = `select * from hacktoon.watch_later where user_fk = ${user_id} and mal_id = ${mal_id} allow filtering`;

        astraClient
            .execute(query)
            .then((result) => {
                if (result.rows.length === 0) {
                    let query = `insert into hacktoon.watch_later( id, user_fk, mal_id, deleted)
                                    values( uuid(), ${user_id}, ${mal_id}, false)`;
                    astraClient
                        .execute(query)
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
                console.log(err);
                return res.status(500).json({ code: 500, msg: "Internal server error" });
            });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ code: 500, msg: "Internal server error" });
    }
};
exports.delete = (req, res) => {
    try {
        const id = req.body.id;
        let query = `select * from hacktoon.watch_later where id = ${id} allow filtering`;

        astraClient
            .execute(query)
            .then((result) => {
                if (result.rows.length > 0) {
                    let query = `update hacktoon.watch_later set deleted = true where id = ${id}`;

                    astraClient
                        .execute(query)
                        .then((response) => {
                            res.status(200).json({
                                code: 200,
                                msg: "Deleted Successfully",
                            });
                        })
                        .catch((err) => {
                            console.log(err);
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
