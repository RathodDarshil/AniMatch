const express = require("express");
const router = express.Router();

const formController = require("../Controllers/forum");

router.get("/all", formController.all);
router.post("/add", formController.add);
router.delete("/delete", formController.delete);

module.exports = router;
