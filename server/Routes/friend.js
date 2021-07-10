const express = require("express");
const router = express.Router();

const friendController = require("../Controllers/friend");

router.get("/all", friendController.all);
router.post("/add", friendController.add);
router.delete("/delete", friendController.delete);

module.exports = router;
