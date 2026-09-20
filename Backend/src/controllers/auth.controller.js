const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User.model");
const Project = require("../models/project.model");
const JoinRequest = require("../models/joinRequest.model");

// ==============================
// REGISTER
// ==============================

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      course,
      year,
      password,
      skills
    } = req.body;

    // Check required fields
    if (
      !name ||
      !email ||
      !course ||
      !year ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields."
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters."
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists."
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      course: course.trim(),
      year,
      password: hashedPassword,
      skills: Array.isArray(skills) ? skills : []
    });

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    // Send response
    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        course: user.course,
        year: user.year,
        skills: user.skills,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating account."
    });
  }
};


// ==============================
// LOGIN
// ==============================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        course: user.course,
        year: user.year,
        skills: user.skills,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while logging in."
    });
  }
};

// GET CURRENT USER
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Get me error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching user."
    });
  }
};


// ==========================================
// GET PROFILE STATS
// ==========================================

const getProfileStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // ------------------------------------------
    // 1. Projects created by the user
    // ------------------------------------------

    const ownedProjects = await Project.find({
      owner: userId
    }).select("_id");

    const ownedProjectIds = ownedProjects.map(
      (project) => project._id
    );

    // ------------------------------------------
    // 2. Projects joined by the user
    // ------------------------------------------

    const acceptedRequests = await JoinRequest.find({
      user: userId,
      status: "accepted"
    }).select("project");

    const joinedProjectIds = acceptedRequests.map(
      (request) => request.project
    );

    // ------------------------------------------
    // 3. Total unique projects
    // ------------------------------------------

    const projectIds = [
      ...ownedProjectIds.map((id) => id.toString()),
      ...joinedProjectIds.map((id) => id.toString())
    ];

    const uniqueProjectIds = [...new Set(projectIds)];

    const projects = uniqueProjectIds.length;

    // ------------------------------------------
    // 4. Requests sent by the user
    // ------------------------------------------

    const requests = await JoinRequest.countDocuments({
      user: userId
    });

    // ------------------------------------------
    // 5. Find teammates
    // ------------------------------------------

    const relevantProjectIds = uniqueProjectIds;

    const acceptedTeamRequests = await JoinRequest.find({
      project: { $in: relevantProjectIds },
      status: "accepted"
    }).select("user project");

    const teammateIds = new Set();

    for (const request of acceptedTeamRequests) {
      const teammateId = request.user.toString();

      // Don't count the logged-in user as their own teammate
      if (teammateId !== userId.toString()) {
        teammateIds.add(teammateId);
      }
    }

    // ------------------------------------------
    // Return stats
    // ------------------------------------------

    return res.status(200).json({
      success: true,
      stats: {
        projects,
        teammates: teammateIds.size,
        requests
      }
    });

  } catch (error) {
    console.error("Get profile stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch profile stats."
    });
  }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      course,
      year,
      bio,
      portfolio,
      skills,
      interests
    } = req.body;

    if (!name || !course || !year) {
      return res.status(400).json({
        success: false,
        message: "Name, course and year are required."
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    user.name = name.trim();
    user.course = course.trim();
    user.year = year;
    user.bio = bio?.trim() || "";
    user.portfolio = portfolio?.trim() || "";

    if (Array.isArray(skills)) {
      user.skills = skills;
    }

    if (Array.isArray(interests)) {
      user.interests = interests;
    }

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: safeUser
    });

  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating profile."
    });
  }
};


module.exports = {
  register,
  login,
  getMe,
  getProfileStats,
  updateProfile
};