const express = require("express");
const router = express.Router();

const completedController = require("../Controllers/completed");

router.get("/all", completedController.all);
router.post("/add", completedController.add);
router.delete("/delete", completedController.delete);

module.exports = router;
