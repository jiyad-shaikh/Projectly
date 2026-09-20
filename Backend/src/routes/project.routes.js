const express = require("express");

const {
  createProject,
  getProjects,
  getProjectById,
  getMyProjects,
  deleteProject
} = require("../controllers/project.controller");

const protect = require("../middleware/auth.middleware");

const router = express.Router();

// Create project
router.post("/", protect, createProject);

// Get all projects
router.get("/", protect, getProjects);

// Get my projects
router.get("/my-projects", protect, getMyProjects);

// Get single project
router.get("/:id", protect, getProjectById);

// Delete project
router.delete("/:id", protect, deleteProject);

module.exports = router;