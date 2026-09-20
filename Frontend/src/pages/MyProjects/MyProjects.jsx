import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageShell from "../../components/PageShell/PageShell";

import { getMyProjects, deleteProject } from "../../services/project.api";

import "./MyProjects.scss";

const tabs = [
  "All Projects",
  "Created by Me",
  "Joined"
];

function formatDeadline(date) {
  if (!date) return "No deadline";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function getInitials(name) {
  if (!name) return "U";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatStatus(status) {
  if (!status) return "Open";

  if (status === "in-progress") {
    return "In Progress";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function MyProjects() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All Projects");

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyProjects();

      setProjects(data.projects || []);
    } catch (error) {
      console.error("Failed to load my projects:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load your projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    if (activeTab === "Created by Me") {
      return project.role === "Owner";
    }

    if (activeTab === "Joined") {
      return project.role === "Member";
    }

    return true;
  });

  const totalProjects = projects.length;

  const activeProjects = projects.filter(
    (project) =>
      project.status === "open" ||
      project.status === "in-progress"
  ).length;

  /*
   * At this stage the backend gives us the project owner
   * and accepted membership separately.
   *
   * For now, count the owner as one team member.
   * Manage Team will later give us the exact accepted-member
   * list and count.
   */
  const totalTeamMembers = projects.reduce(
    (total, project) => {
      return total + 1;
    },
    0
  );

  const handleDelete = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this project? This action cannot be undone."
  );

  if (!confirmed) return;

  try {
    setDeletingId(id);
    setError("");

    await deleteProject(id);

    setProjects((previous) =>
      previous.filter((project) => project._id !== id)
    );
  } catch (error) {
    console.error("Failed to delete project:", error);

    setError(
      error.response?.data?.message ||
        "Unable to delete this project."
    );
  } finally {
    setDeletingId(null);
  }
};

  return (
    <PageShell
      sidebarOpen={sidebarOpen}
      onSidebarOpen={() => setSidebarOpen(true)}
      onSidebarClose={() => setSidebarOpen(false)}
    >
      <div className="my-projects-page">

        {/* ================================
            HEADER
        ================================= */}

        <header className="my-projects-page__header">

          <div>
            <p className="my-projects-page__eyebrow">
              YOUR WORKSPACE
            </p>

            <h1>
              My Projects
            </h1>

            <p className="my-projects-page__subtitle">
              Manage the projects you're building and the teams
              you're part of.
            </p>
          </div>

          <Link
            to="/create-project"
            className="my-projects-page__create-btn"
          >
            + Create Project
          </Link>

        </header>


        {/* ================================
            ERROR
        ================================= */}

        {error && (
          <div className="my-projects-page__error">
            <span>{error}</span>

            <button onClick={loadProjects}>
              Try Again
            </button>
          </div>
        )}


        {/* ================================
            SUMMARY
        ================================= */}

        <section className="my-projects-page__summary">

          <div className="my-projects-page__summary-card">

            <div className="my-projects-page__summary-icon">
              ◫
            </div>

            <div>
              <strong>
                {loading ? "—" : totalProjects}
              </strong>

              <span>
                Total Projects
              </span>
            </div>

          </div>


          <div className="my-projects-page__summary-card">

            <div className="my-projects-page__summary-icon">
              ✦
            </div>

            <div>
              <strong>
                {loading ? "—" : activeProjects}
              </strong>

              <span>
                Active Projects
              </span>
            </div>

          </div>


          <div className="my-projects-page__summary-card">

            <div className="my-projects-page__summary-icon">
              ◎
            </div>

            <div>
              <strong>
                {loading ? "—" : totalTeamMembers}
              </strong>

              <span>
                Team Members
              </span>
            </div>

          </div>

        </section>


        {/* ================================
            TABS
        ================================= */}

        <div className="my-projects-page__tabs">

          {tabs.map((tab) => {

            const count =
              tab === "All Projects"
                ? projects.length
                : tab === "Created by Me"
                ? projects.filter(
                    (project) =>
                      project.role === "Owner"
                  ).length
                : projects.filter(
                    (project) =>
                      project.role === "Member"
                  ).length;

            return (
              <button
                key={tab}
                className={
                  activeTab === tab
                    ? "my-projects-page__tab active"
                    : "my-projects-page__tab"
                }
                onClick={() => setActiveTab(tab)}
              >
                {tab}

                <span>
                  {loading ? "—" : count}
                </span>

              </button>
            );
          })}

        </div>


        {/* ================================
            PROJECT CONTENT
        ================================= */}

        <section className="my-projects-page__content">

          <div className="my-projects-page__section-heading">

            <div>

              <h2>
                {activeTab}
              </h2>

              <p>
                {loading
                  ? "Loading your projects..."
                  : `${filteredProjects.length} project${
                      filteredProjects.length !== 1
                        ? "s"
                        : ""
                    }`}
              </p>

            </div>

          </div>


          {/* ================================
              LOADING
          ================================= */}

          {loading ? (

            <div className="my-projects-page__empty">

              <div className="my-projects-page__empty-icon">
                ◫
              </div>

              <h3>
                Loading projects...
              </h3>

              <p>
                Fetching your projects from Projectly.
              </p>

            </div>

          ) : filteredProjects.length > 0 ? (

            <div className="my-projects-page__list">

              {filteredProjects.map((project) => {

                const status = formatStatus(
                  project.status
                );

                const ownerInitials = getInitials(
                  project.owner?.name
                );

                return (
                  <article
                    className="my-project-card"
                    key={project._id}
                  >

                    {/* ================================
                        TOP
                    ================================= */}

                    <div className="my-project-card__top">

                      <div className="my-project-card__title-area">

                        <div className="my-project-card__icon">
                          ◫
                        </div>

                        <div>

                          <div className="my-project-card__badges">

                            <span className="my-project-card__category">
                              {project.category}
                            </span>

                            <span
                              className={`my-project-card__status my-project-card__status--${project.status}`}
                            >
                              <span></span>
                              {status}
                            </span>

                          </div>

                          <h3>
                            {project.title}
                          </h3>

                          <p>
                            {project.description}
                          </p>

                        </div>

                      </div>


                      <span
                        className={
                          project.role === "Owner"
                            ? "my-project-card__role owner"
                            : "my-project-card__role"
                        }
                      >
                        {project.role}
                      </span>

                    </div>


                    {/* ================================
                        SKILLS
                    ================================= */}

                    <div className="my-project-card__skills">

                      {(project.requiredSkills || []).map(
                        (skill) => (
                          <span key={skill}>
                            {skill}
                          </span>
                        )
                      )}

                    </div>


                    {/* ================================
                        BOTTOM
                    ================================= */}

                    <div className="my-project-card__bottom">

                      <div className="my-project-card__meta">

                        <div className="my-project-card__team">

                          <div className="my-project-card__avatars">

                            <div className="my-project-card__avatar">
                              {ownerInitials}
                            </div>

                          </div>

                          <span>
                            1 / {project.teamSize} members
                          </span>

                        </div>


                        <div className="my-project-card__deadline">

                          <span>
                            DEADLINE
                          </span>

                          <strong>
                            {formatDeadline(
                              project.deadline
                            )}
                          </strong>

                        </div>

                      </div>


                      <div className="my-project-card__actions">

                        <Link
                          to={`/projects/${project._id}`}
                          className="my-project-card__view"
                        >
                          View
                        </Link>


                        {project.role === "Owner" && (
                          <>
                            <button
                              className="my-project-card__manage"
                              onClick={() => {
                                // Manage Team will be connected next.
                              }}
                            >
                              Manage Team
                            </button>

                            <button
                              className="my-project-card__delete"
                              disabled={deletingId === project._id}
                              onClick={() => handleDelete(project._id)}
                            >
                              {deletingId === project._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </>
                        )}

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>

          ) : (

            <div className="my-projects-page__empty">

              <div className="my-projects-page__empty-icon">
                ◫
              </div>

              <h3>
                No projects here yet
              </h3>

              <p>
                {activeTab === "Joined"
                  ? "You haven't joined any projects yet."
                  : "Create your first project and start building your team."}
              </p>

              <Link to="/create-project">
                Create a Project →
              </Link>

            </div>

          )}

        </section>

      </div>
    </PageShell>
  );
}

export default MyProjects;