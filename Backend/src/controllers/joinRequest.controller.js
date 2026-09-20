const JoinRequest = require("../models/joinRequest.model");
const Project = require("../models/project.model");

const createJoinRequest = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: projectId } = req.params;

    // Check whether project exists
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found."
      });
    }

    // Owner cannot request to join their own project
    if (project.owner.toString() === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot request to join your own project."
      });
    }

    // Only open projects should accept requests
    if (project.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "This project is no longer accepting requests."
      });
    }

    // Check if request already exists
    const existingRequest = await JoinRequest.findOne({
      project: projectId,
      user: req.user.userId
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: `You already have a ${existingRequest.status} request for this project.`
      });
    }

    // Create request
    const joinRequest = await JoinRequest.create({
      project: projectId,
      user: req.user.userId,
      message: message || ""
    });

    const populatedRequest = await joinRequest.populate([
      {
        path: "user",
        select: "name email course year skills"
      },
      {
        path: "project",
        select: "title category teamSize deadline status owner"
      }
    ]);

    return res.status(201).json({
      success: true,
      message: "Join request sent successfully.",
      request: populatedRequest
    });

  } catch (error) {
    console.error("Create join request error:", error);

    // Handle MongoDB duplicate-key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already requested to join this project."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to send join request."
    });
  }
};

const getProjectRequests = async (req, res) => {
  try {
    const { id: projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found."
      });
    }

    // Only the project owner can view its requests
    if (project.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Only the project owner can view these requests."
      });
    }

    const requests = await JoinRequest.find({
      project: projectId
    })
      .populate("user", "name email course year bio skills interests")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });

  } catch (error) {
    console.error("Get project requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch join requests."
    });
  }
};


const acceptJoinRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await JoinRequest.findById(requestId)
      .populate("project")
      .populate("user", "name email course year skills interests");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Join request not found."
      });
    }

    const project = request.project;

    // Only project owner can accept
    if (project.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Only the project owner can accept requests."
      });
    }

    // Request must still be pending
    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `This request has already been ${request.status}.`
      });
    }

    // Count accepted members
    const acceptedCount = await JoinRequest.countDocuments({
      project: project._id,
      status: "accepted"
    });

    // Team size includes the project owner
    const currentTeamSize = acceptedCount + 1;

    if (currentTeamSize >= project.teamSize) {
      return res.status(400).json({
        success: false,
        message: "This project has reached its maximum team size."
      });
    }

    request.status = "accepted";
    await request.save();

    // If the team is now full, mark project in-progress
    const newTeamSize = currentTeamSize + 1;

    if (newTeamSize >= project.teamSize) {
      project.status = "in-progress";
      await project.save();
    }

    const populatedRequest = await JoinRequest.findById(request._id)
      .populate("user", "name email course year bio skills interests")
      .populate("project", "title category teamSize deadline status owner");

    return res.status(200).json({
      success: true,
      message: "Join request accepted successfully.",
      request: populatedRequest
    });

  } catch (error) {
    console.error("Accept join request error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to accept join request."
    });
  }
};


const rejectJoinRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await JoinRequest.findById(requestId)
      .populate("project")
      .populate("user", "name email course year skills interests");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Join request not found."
      });
    }

    const project = request.project;

    // Only project owner can reject
    if (project.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Only the project owner can reject requests."
      });
    }

    // Request must still be pending
    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `This request has already been ${request.status}.`
      });
    }

    request.status = "rejected";
    await request.save();

    const populatedRequest = await JoinRequest.findById(request._id)
      .populate("user", "name email course year bio skills interests")
      .populate("project", "title category teamSize deadline status owner");

    return res.status(200).json({
      success: true,
      message: "Join request rejected.",
      request: populatedRequest
    });

  } catch (error) {
    console.error("Reject join request error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject join request."
    });
  }
};

const getMyReceivedRequests = async (req, res) => {
  try {
    // Find all projects owned by the logged-in student
    const projects = await Project.find({
      owner: req.user.userId
    }).select("_id");

    const projectIds = projects.map((project) => project._id);

    // Find requests belonging to those projects
    const requests = await JoinRequest.find({
      project: { $in: projectIds }
    })
      .populate(
        "user",
        "name email course year bio skills interests profileImage"
      )
      .populate(
        "project",
        "title category teamSize deadline status owner"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });

  } catch (error) {
    console.error("Get received requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch received requests."
    });
  }
};

// GET MY SENT REQUESTS
const getMySentRequests = async (req, res) => {
  try {
    const requests = await JoinRequest.find({
      user: req.user.userId
    })
      .populate(
        "project",
        "title category teamSize deadline status owner"
      )
      .populate(
        "project.owner",
        "name course year"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });

  } catch (error) {
    console.error("Get my sent requests error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch your requests."
    });
  }
};

module.exports = {
  createJoinRequest,
  getProjectRequests,
  getMyReceivedRequests,
  acceptJoinRequest,
  rejectJoinRequest,
  getMySentRequests
};