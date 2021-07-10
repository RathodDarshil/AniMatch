const express = require("express");
const router = express.Router();

const watchLaterController = require("../Controllers/watch_later");

router.get("/all", watchLaterController.all);
router.post("/add", watchLaterController.add);
router.delete("/delete", watchLaterController.delete);

module.exports = router;
