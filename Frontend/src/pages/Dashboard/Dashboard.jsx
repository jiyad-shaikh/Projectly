import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import StatCard from "../../components/StatCard/StatCard";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import PageShell from "../../components/PageShell/PageShell";

import { getProjects, getMyProjects } from "../../services/project.api";
import { getSentRequests, getReceivedRequests } from "../../services/request.api";

import "./Dashboard.scss";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [projects, setProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);

  const [stats, setStats] = useState({
    availableProjects: 0,
    pendingRequests: 0,
    myProjects: 0,
    teamMembers: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDeadline = (deadline) => {
    if (!deadline) return "No deadline";

    const date = new Date(deadline);

    if (Number.isNaN(date.getTime())) {
      return "No deadline";
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit"
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const mapProjectForCard = (project) => {
    const ownerName =
      project.owner?.name ||
      project.owner?.fullName ||
      "Student";

    return {
      ...project,
      id: project._id,
      title: project.title,
      description: project.description,
      category: project.category,
      skills: project.requiredSkills || [],
      members: [getInitials(ownerName)],
      teamSize: project.teamSize,
      deadline: formatDeadline(project.deadline)
    };
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          projectsResponse,
          myProjectsResponse,
          sentRequestsResponse,
          receivedRequestsResponse
        ] = await Promise.all([
          getProjects(),
          getMyProjects(),
          getSentRequests(),
          getReceivedRequests()
        ]);

        const allProjects = projectsResponse.projects || [];
        const userProjects = myProjectsResponse.projects || [];
        const sentRequests = sentRequestsResponse.requests || [];
        const receivedRequests =
          receivedRequestsResponse.requests || [];

        // ------------------------------------------
        // Available projects
        // ------------------------------------------

        const availableProjects = allProjects.filter(
          (project) => project.status === "open"
        );

        // ------------------------------------------
        // Pending requests
        // ------------------------------------------

        const pendingSentRequests = sentRequests.filter(
          (request) =>
            request.status?.toLowerCase() === "pending"
        );

        const pendingReceivedRequests = receivedRequests.filter(
          (request) =>
            request.status?.toLowerCase() === "pending"
        );

        // ------------------------------------------
        // Team members
        // ------------------------------------------

        const acceptedReceivedRequests =
          receivedRequests.filter(
            (request) =>
              request.status?.toLowerCase() === "accepted"
          );

        const uniqueMembers = new Set();

        acceptedReceivedRequests.forEach((request) => {
          if (request.user?._id) {
            uniqueMembers.add(request.user._id);
          }
        });

        // ------------------------------------------
        // Save projects
        // ------------------------------------------

        setProjects(allProjects);
        setMyProjects(userProjects);

        setStats({
          availableProjects: availableProjects.length,

          // Requests waiting for the logged-in user
          // to act on.
          pendingRequests: pendingReceivedRequests.length,

          myProjects: userProjects.length,

          teamMembers: uniqueMembers.size
        });
      } catch (error) {
        console.error("Failed to load dashboard:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load your dashboard. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const yourProjects = myProjects
    .slice(0, 2)
    .map(mapProjectForCard);

  const discoverProjects = projects
    .filter((project) => project.status === "open")
    .slice(0, 3)
    .map(mapProjectForCard);

  return (
    <PageShell
      sidebarOpen={sidebarOpen}
      onSidebarOpen={() => setSidebarOpen(true)}
      onSidebarClose={() => setSidebarOpen(false)}
    >

      <div className="dashboard">

        {/* ========================================
            HEADER
        ======================================== */}

        <header className="dashboard__header">

          <div>
            <p className="dashboard__eyebrow">
              STUDENT DASHBOARD
            </p>

            <h1>
              Good morning, Jiyad 👋
            </h1>

            <p className="dashboard__subtitle">
              Find teammates, discover projects, and build something great.
            </p>
          </div>

          <Link
            to="/create-project"
            className="dashboard__create-btn"
          >
            + Create Project
          </Link>

        </header>


        {/* ========================================
            ERROR
        ======================================== */}

        {error && (
          <div className="dashboard__error">
            {error}
          </div>
        )}


        {/* ========================================
            STATISTICS
        ======================================== */}

        <section className="dashboard__stats">

          <StatCard
            icon="◫"
            value={loading ? "—" : stats.availableProjects}
            label="Available Projects"
            description="Projects looking for teammates"
          />

          <StatCard
            icon="♢"
            value={loading ? "—" : stats.pendingRequests}
            label="Pending Requests"
            description="Requests waiting for action"
          />

          <StatCard
            icon="▣"
            value={loading ? "—" : stats.myProjects}
            label="My Projects"
            description="Projects you're part of"
          />

          <StatCard
            icon="✓"
            value={loading ? "—" : stats.teamMembers}
            label="Team Members"
            description="Students you've teamed up with"
          />

        </section>


        {/* ========================================
            YOUR PROJECTS
        ======================================== */}

        <section className="dashboard__section">

          <div className="dashboard__section-header">

            <div>
              <h2>
                Your Projects
              </h2>

              <p>
                Projects you are currently working on.
              </p>
            </div>

            <Link
              to="/my-projects"
              className="dashboard__section-link"
            >
              View all →
            </Link>

          </div>


          <div className="dashboard__projects">

            {loading ? (
              <p>Loading your projects...</p>
            ) : yourProjects.length > 0 ? (
              yourProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  {...project}
                />
              ))
            ) : (
              <p>
                You haven't joined or created any projects yet.
              </p>
            )}

          </div>

        </section>


        {/* ========================================
            DISCOVER PROJECTS
        ======================================== */}

        <section className="dashboard__section">

          <div className="dashboard__section-header">

            <div>
              <h2>
                Discover Projects
              </h2>

              <p>
                Find projects that match your skills and interests.
              </p>
            </div>

            <Link
              to="/projects"
              className="dashboard__section-link"
            >
              Explore all →
            </Link>

          </div>


          <div className="dashboard__projects">

            {loading ? (
              <p>Loading projects...</p>
            ) : discoverProjects.length > 0 ? (
              discoverProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  {...project}
                />
              ))
            ) : (
              <p>
                No open projects are available right now.
              </p>
            )}

          </div>

        </section>

      </div>
    </PageShell>
  );
}

export default Dashboard;