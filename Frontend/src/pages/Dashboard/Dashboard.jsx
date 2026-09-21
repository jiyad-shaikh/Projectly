import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";

import { Link } from "react-router-dom";
import gsap from "gsap";

import StatCard from "../../components/StatCard/StatCard";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import PageShell from "../../components/PageShell/PageShell";

import { getProjects, getMyProjects } from "../../services/project.api";
import {
  getSentRequests,
  getReceivedRequests
} from "../../services/request.api";

import { useAuth } from "../../hooks/useAuth";

import "./Dashboard.scss";

function Dashboard() {
  const { user } = useAuth();

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

  // ========================================
  // GSAP REFS
  // ========================================

  const dashboardRef = useRef(null);
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const sectionRefs = useRef([]);
  const projectRefs = useRef([]);

  const addSectionRef = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  const addProjectRef = (el) => {
    if (el && !projectRefs.current.includes(el)) {
      projectRefs.current.push(el);
    }
  };

  // ========================================
  // HELPERS
  // ========================================

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

  // ========================================
  // LOAD DASHBOARD
  // ========================================

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

        // ========================================
        // AVAILABLE PROJECTS
        // ========================================

        const availableProjects = allProjects.filter(
          (project) => project.status === "open"
        );

        // ========================================
        // PENDING REQUESTS
        // ========================================

        const pendingSentRequests = sentRequests.filter(
          (request) =>
            request.status?.toLowerCase() === "pending"
        );

        const pendingReceivedRequests = receivedRequests.filter(
          (request) =>
            request.status?.toLowerCase() === "pending"
        );

        // ========================================
        // TEAM MEMBERS
        // ========================================

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

        // ========================================
        // SAVE PROJECTS
        // ========================================

        setProjects(allProjects);
        setMyProjects(userProjects);

        setStats({
          availableProjects: availableProjects.length,
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

  // ========================================
  // GSAP DASHBOARD ENTRANCE
  // ========================================

  useLayoutEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      // Respect reduced-motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(
          [
            ".dashboard__header-content",
            ".dashboard__create-btn",
            ".dashboard__stat-item",
            ".dashboard__section",
            ".dashboard__project-item"
          ],
          {
            clearProps: "all"
          }
        );

        return;
      }

      // ----------------------------------------
      // Initial states
      // ----------------------------------------

      gsap.set(".dashboard__header-content", {
        opacity: 0,
        y: 18
      });

      gsap.set(".dashboard__create-btn", {
        opacity: 0,
        y: 18,
        scale: 0.96
      });

      gsap.set(".dashboard__stat-item", {
        opacity: 0,
        y: 25,
        scale: 0.97
      });

      gsap.set(".dashboard__section", {
        opacity: 0,
        y: 20
      });

      gsap.set(".dashboard__project-item", {
        opacity: 0,
        y: 25,
        scale: 0.98
      });

      // ----------------------------------------
      // Main entrance timeline
      // ----------------------------------------

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out"
        }
      });

      tl.to(".dashboard__header-content", {
        opacity: 1,
        y: 0,
        duration: 0.65
      })
        .to(
          ".dashboard__create-btn",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55
          },
          "-=0.45"
        )
        .to(
          ".dashboard__stat-item",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.09
          },
          "-=0.25"
        )
        .to(
          ".dashboard__section",
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.12
          },
          "-=0.2"
        )
        .to(
          ".dashboard__project-item",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.08
          },
          "-=0.25"
        );

      // ----------------------------------------
      // Create button hover
      // ----------------------------------------

      const createButton = document.querySelector(
        ".dashboard__create-btn"
      );

      if (createButton) {
        const enter = () => {
          gsap.to(createButton, {
            scale: 1.035,
            y: -2,
            duration: 0.2,
            ease: "power2.out"
          });
        };

        const leave = () => {
          gsap.to(createButton, {
            scale: 1,
            y: 0,
            duration: 0.2,
            ease: "power2.out"
          });
        };

        createButton.addEventListener("mouseenter", enter);
        createButton.addEventListener("mouseleave", leave);

        createButton._gsapEnter = enter;
        createButton._gsapLeave = leave;
      }

      // ----------------------------------------
      // Project card hover
      // ----------------------------------------

      projectRefs.current.forEach((card) => {
        if (!card) return;

        const enter = () => {
          gsap.to(card, {
            y: -5,
            scale: 1.012,
            duration: 0.22,
            ease: "power2.out"
          });
        };

        const leave = () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.22,
            ease: "power2.out"
          });
        };

        card.addEventListener("mouseenter", enter);
        card.addEventListener("mouseleave", leave);

        card._gsapEnter = enter;
        card._gsapLeave = leave;
      });
    }, dashboardRef);

    return () => {
      // Remove manually added listeners
      const createButton = document.querySelector(
        ".dashboard__create-btn"
      );

      if (createButton?._gsapEnter) {
        createButton.removeEventListener(
          "mouseenter",
          createButton._gsapEnter
        );

        createButton.removeEventListener(
          "mouseleave",
          createButton._gsapLeave
        );
      }

      projectRefs.current.forEach((card) => {
        if (!card) return;

        if (card._gsapEnter) {
          card.removeEventListener(
            "mouseenter",
            card._gsapEnter
          );

          card.removeEventListener(
            "mouseleave",
            card._gsapLeave
          );
        }
      });

      ctx.revert();

      sectionRefs.current = [];
      projectRefs.current = [];
    };
  }, [loading, yourProjects?.length, discoverProjects?.length]);

  return (
    <PageShell
      sidebarOpen={sidebarOpen}
      onSidebarOpen={() => setSidebarOpen(true)}
      onSidebarClose={() => setSidebarOpen(false)}
    >
      <div
        className="dashboard"
        ref={dashboardRef}
      >
        {/* ========================================
            HEADER
        ======================================== */}

        <header className="dashboard__header">
          <div className="dashboard__header-content">
            <p className="dashboard__eyebrow">
              STUDENT DASHBOARD
            </p>

            <h1>
              Welcome,{" "}
              {user?.name?.split(" ")[0] || "there"} 👋
            </h1>

            <p className="dashboard__subtitle">
              Find teammates, discover projects, and build
              something great.
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

        <section
          className="dashboard__stats"
          ref={statsRef}
        >
          <div className="dashboard__stat-item">
            <StatCard
              icon="◫"
              value={loading ? "—" : stats.availableProjects}
              label="Available Projects"
              description="Projects looking for teammates"
            />
          </div>

          <div className="dashboard__stat-item">
            <StatCard
              icon="♢"
              value={loading ? "—" : stats.pendingRequests}
              label="Pending Requests"
              description="Requests waiting for action"
            />
          </div>

          <div className="dashboard__stat-item">
            <StatCard
              icon="▣"
              value={loading ? "—" : stats.myProjects}
              label="My Projects"
              description="Projects you're part of"
            />
          </div>

          <div className="dashboard__stat-item">
            <StatCard
              icon="✓"
              value={loading ? "—" : stats.teamMembers}
              label="Team Members"
              description="Students you've teamed up with"
            />
          </div>
        </section>

        {/* ========================================
            YOUR PROJECTS
        ======================================== */}

        <section
          className="dashboard__section"
          ref={addSectionRef}
        >
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
                <div
                  className="dashboard__project-item"
                  ref={addProjectRef}
                  key={project._id}
                >
                  <ProjectCard
                    {...project}
                  />
                </div>
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

        <section
          className="dashboard__section"
          ref={addSectionRef}
        >
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
                <div
                  className="dashboard__project-item"
                  ref={addProjectRef}
                  key={project._id}
                >
                  <ProjectCard
                    {...project}
                  />
                </div>
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