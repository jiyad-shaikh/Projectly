const Project = require("../models/project.model");
const JoinRequest = require("../models/joinRequest.model");

// ==========================================
// CREATE PROJECT
// ==========================================

const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      requiredSkills,
      teamSize,
      deadline
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !teamSize ||
      !deadline
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields."
      });
    }

    const project = await Project.create({
      owner: req.user.userId,
      title,
      description,
      category,
      requiredSkills: requiredSkills || [],
      teamSize,
      deadline
    });

    const populatedProject = await project.populate(
      "owner",
      "name email course year"
    );

    res.status(201).json({
      success: true,
      message: "Project created successfully.",
      project: populatedProject
    });

  } catch (error) {
    console.error("Create project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create project."
    });
  }
};

// ==========================================
// GET ALL PROJECTS
// ==========================================

const getProjects = async (req, res) => {
  try {

    const projects = await Project.find()
      .populate("owner", "name course year")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });

  } catch (error) {
    console.error("Get projects error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch projects."
    });
  }
};

// ==========================================
// GET SINGLE PROJECT
// ==========================================

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email course year bio skills");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found."
      });
    }

    // Get all accepted join requests for this project
    const acceptedRequests = await JoinRequest.find({
      project: project._id,
      status: "accepted"
    }).populate(
      "user",
      "name email course year bio skills"
    );

    // Owner is automatically the first team member
    const teamMembers = [
      project.owner,
      ...acceptedRequests
        .map((request) => request.user)
        .filter(Boolean)
    ];

    res.status(200).json({
      success: true,
      project: {
        ...project.toObject(),
        teamMembers,
        teamCount: teamMembers.length
      }
    });

  } catch (error) {
    console.error("Get project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch project."
    });
  }
};

const getMyProjects = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Projects created by the logged-in user
    const ownedProjects = await Project.find({
      owner: userId
    })
      .populate("owner", "name course year")
      .sort({ createdAt: -1 });

    // Projects where the logged-in user was accepted
    const acceptedRequests = await JoinRequest.find({
      user: userId,
      status: "accepted"
    }).select("project");

    const joinedProjectIds = acceptedRequests.map(
      (request) => request.project
    );

    const joinedProjects = await Project.find({
      _id: { $in: joinedProjectIds },
      owner: { $ne: userId }
    })
      .populate("owner", "name course year")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      projects: [
        ...ownedProjects.map((project) => ({
          ...project.toObject(),
          role: "Owner"
        })),
        ...joinedProjects.map((project) => ({
          ...project.toObject(),
          role: "Member"
        }))
      ]
    });
  } catch (error) {
    console.error("Get my projects error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch your projects."
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found."
      });
    }

    // Only the project owner can delete it
    if (project.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this project."
      });
    }

    // Remove related join requests first
    await JoinRequest.deleteMany({
      project: project._id
    });

    await Project.findByIdAndDelete(project._id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully."
    });
  } catch (error) {
    console.error("Delete project error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete project."
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  getMyProjects,
  deleteProject
};