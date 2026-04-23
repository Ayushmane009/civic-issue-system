const express = require("express");
const router = express.Router();

const {
  reportIssue,
  getAllIssues,
  getIssueById,
  updateIssueStatus,
  addComment,
  deleteIssue,
  toggleUpvote
} = require("../controllers/issueController");

const upload = require("../middleware/upload");
const { verifyToken } = require("../middleware/authMiddleware");

// POST issue
router.post("/report", verifyToken, upload.single("image"), reportIssue);

// GET all issues
router.get("/all", getAllIssues);

// GET single issue
router.get("/:id", getIssueById);

// UPDATE status
router.put("/status", verifyToken, updateIssueStatus);

// DELETE issue
router.delete("/:id", verifyToken, deleteIssue);

// TOGGLE upvote
router.post("/:id/upvote", verifyToken, toggleUpvote);

// ADD comment
router.post("/comment", verifyToken, addComment);

module.exports = router;