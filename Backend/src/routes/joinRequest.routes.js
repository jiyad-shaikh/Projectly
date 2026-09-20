const express = require("express");

const {
  createJoinRequest,
  getProjectRequests,
  getMyReceivedRequests,
  acceptJoinRequest,
  rejectJoinRequest,
  getMySentRequests
} = require("../controllers/joinRequest.controller");

const protect = require("../middleware/auth.middleware");

const router = express.Router();

// Student sends request
router.post("/projects/:id/requests",protect,createJoinRequest);

// Project owner views requests
router.get("/projects/:id/requests",protect,getProjectRequests);

// Owner views all requests received for their projects
router.get("/requests/received",protect,getMyReceivedRequests);

// Project owner accepts request
router.patch("/requests/:requestId/accept",protect,acceptJoinRequest);

// Project owner rejects request
router.patch("/requests/:requestId/reject",protect,rejectJoinRequest);

// Student views all requests sent
router.get("/requests/sent",protect,getMySentRequests);

module.exports = router;