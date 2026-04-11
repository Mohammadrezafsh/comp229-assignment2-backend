const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/authController");

router.post("/signin", ctrl.signIn);

module.exports = router;
