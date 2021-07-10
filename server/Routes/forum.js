const express = require("express");
const router = express.Router();

const formController = require("../Controllers/forum");

router.post("/add-comment", formController.addComment);
router.get("/main-thread", formController.mainThread);
router.get("/replys", formController.replys);
router.post("/like", formController.like);

module.exports = router;
