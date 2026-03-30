const express = require("express");
const router = express.Router();
const { getDepartments, getDeptIssues } = require("../controllers/deptController");

router.get("/", getDepartments);
router.get("/:id/issues", getDeptIssues);

module.exports = router;

