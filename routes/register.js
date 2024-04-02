const { handleNewUser } = require("../controllers/registerController");
const express = require("express");
const router = express.Router();

router.post("/", handleNewUser);

module.exports = router;
