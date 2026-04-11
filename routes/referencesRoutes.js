const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/referencesController");
const { requireAuth } = require("../middleware/auth");

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", requireAuth, ctrl.add);
router.put("/:id", requireAuth, ctrl.update);
router.delete("/:id", requireAuth, ctrl.remove);

module.exports = router;