const express = require("express");
const router = express.Router();

const {
  reportIssue,
  getAllIssues,
  getIssueById,
  getIssuesByDepartment,
  updateIssueStatus,
  updateIssuePriority,
  addRemarks,
  addComment,
  deleteIssue,
  toggleUpvote
} = require("../controllers/issueController");

const upload = require("../middleware/upload");
const { verifyToken } = require("../middleware/authMiddleware");

// POST issue (auto-assigns department based on category)
router.post("/report", verifyToken, upload.single("image"), reportIssue);

// GET all issues
router.get("/all", getAllIssues);

// GET issues by department (with optional ?status= filter)
router.get("/department/:deptId", verifyToken, getIssuesByDepartment);

// GET single issue
router.get("/:id", getIssueById);

// UPDATE status (department-scoped for admins)
router.put("/status", verifyToken, updateIssueStatus);

// UPDATE priority (department-scoped for admins)
router.put("/priority", verifyToken, updateIssuePriority);

// ADD remarks (admin only)
router.put("/remarks", verifyToken, addRemarks);

// DELETE issue (department-scoped for admins)
router.delete("/:id", verifyToken, deleteIssue);

// TOGGLE upvote
router.post("/:id/upvote", verifyToken, toggleUpvote);

// ADD comment
router.post("/comment", verifyToken, addComment);

module.exports = router;