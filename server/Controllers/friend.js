const async = require("async");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { PrismaClient } = require("@prisma/client");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const astraClient = require("../connect-database");

const prisma = new PrismaClient();

exports.all = async (req, res) => {
    try {
        const user_fk = req.user.id;

        // const friends = await prisma.$queryRaw`select * from friends f left join "User" u on f.user_friend_fk = u.id;`;

        let query = `select * from hacktoon.friends where user_fk = ${user_fk} allow filtering`;

        const friends = await astraClient.execute(query);

        if (friends.rows.length > 0) {
            friends.rows.forEach((friend) => {
                let query = `select * from hacktoon.User where id = ${friend.user_friend_fk}`;
                astraClient
                    .execute(query)
                    .then((results) => {
                        friend.friend_data = results.rows[0];
                    })
                    .then(() => {
                        res.status(200).json({
                            code: 200,
                            data: friends,
                        });
                    });
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ code: 500, msg: "Internal server error" });
    }
};
exports.add = (req, res) => {
    try {
        const user_friend_fk = req.body.user_id;
        const user_fk = req.user.id;
        let query = `select * from hacktoon.User where id = ${user_friend_fk}`;
        astraClient.execute(query).then((response) => {
            if (response.rows.length > 0) {
                let query = `select * from hacktoon.friends where user_fk = ${user_fk} and user_friend_fk=${user_friend_fk} allow filtering`;

                astraClient
                    .execute(query)
                    .then((result) => {
                        if (result.rows.length === 0) {
                            let query = `insert into hacktoon.friends( id, user_fk, user_friend_fk)
                                    values( uuid(), ${user_fk}, ${user_friend_fk})`;

                            astraClient
                                .execute(query)
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
                        console.log(err);
                        return res.status(500).json({ code: 500, msg: "Internal server error" });
                    });
            } else {
                res.status(404).json({ code: 404, msg: "User not found" });
            }
        });
    } catch (e) {
        return res.status(500).json({ code: 500, msg: "Internal server error" });
    }
};
exports.delete = async (req, res) => {
    try {
        const id = req.body.id;
        const user_fk = req.user.id;
        const deletion = await astraClient.execute(
            `delete from hacktoon.friends where id = ${id} if user_fk = ${user_fk}`
        );
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
