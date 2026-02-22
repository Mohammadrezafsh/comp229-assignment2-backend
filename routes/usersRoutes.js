const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/usersController");

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", ctrl.add);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;