const express = require("express");
const authUser = require("../middleware/authUser");
const router = express.Router();
const user = require("./user");
const watch_later = require("./watch_later");
const completed = require("./completed");
const friend = require("./friend");
const forum = require("./forum");

router.use("/user", user);
router.use("/watch_later", authUser, watch_later);
router.use("/completed", authUser, completed);
router.use("/friend", authUser, friend);
router.use("/forum", authUser, forum);

module.exports = router;
