const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const {
  getDepartments,
  createDepartment,
  getDeptIssues,
  assignAdminToDept,
  getDeptStats,
  getDeptAdmins
} = require("../controllers/deptController");

// GET all departments (public)
router.get("/", getDepartments);

// POST create department (admin only)
router.post("/", verifyToken, isAdmin, createDepartment);

// PUT assign admin to department (admin only)
router.put("/assign-admin", verifyToken, isAdmin, assignAdminToDept);

// GET issues by department (with optional ?status= filter)
router.get("/:id/issues", getDeptIssues);

// GET department statistics
router.get("/:id/stats", getDeptStats);

// GET admins in a department (admin only)
router.get("/:id/admins", verifyToken, isAdmin, getDeptAdmins);

module.exports = router;
