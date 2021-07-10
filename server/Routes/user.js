const express = require("express");
const router = express.Router();

const userController = require("../Controllers/user");

router.post("/login", userController.loginUser);

module.exports = router;
