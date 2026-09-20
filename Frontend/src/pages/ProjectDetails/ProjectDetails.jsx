import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import PageShell from "../../components/PageShell/PageShell";
import { createJoinRequest, getProjectById } from "../../services/project.api";

import "./ProjectDetails.scss";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [joinMessage, setJoinMessage] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProjectById(id);

        setProject(data.project);
      } catch (error) {
        console.error("Failed to load project:", error);

        setError(
          error.response?.data?.message ||
          "Unable to load project."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  const openJoinModal = () => {
    setJoinError("");
    setJoinMessage("");
    setJoinSuccess(false);
    setJoinModalOpen(true);
  };

  const closeJoinModal = () => {
    if (joinLoading) {
      return;
    }

    setJoinModalOpen(false);
    setJoinError("");
    setJoinMessage("");
  };

  const handleJoinRequest = async (event) => {
    event.preventDefault();

    setJoinError("");

    try {
      setJoinLoading(true);

      const data = await createJoinRequest(
        id,
        joinMessage.trim()
      );

      console.log("Join request created:", data);

      setJoinSuccess(true);

    } catch (error) {
      console.error("Join request error:", error);

      setJoinError(
        error.response?.data?.message ||
        "Unable to send your request. Please try again."
      );
    } finally {
      setJoinLoading(false);
    }
  };

  if (loading) {
    return (
      <PageShell
        sidebarOpen={sidebarOpen}
        onSidebarOpen={() => setSidebarOpen(true)}
        onSidebarClose={() => setSidebarOpen(false)}
      >
        <div className="project-details__state">
          <div className="project-details__spinner"></div>

          <h2>Loading project...</h2>

          <p>
            We're fetching the project details.
          </p>
        </div>
      </PageShell>
    );
  }

  if (error || !project) {
    return (
      <PageShell
        sidebarOpen={sidebarOpen}
        onSidebarOpen={() => setSidebarOpen(true)}
        onSidebarClose={() => setSidebarOpen(false)}
      >
        <div className="project-details__state">
          <div className="project-details__state-icon">
            !
          </div>

          <h2>Project not found</h2>

          <p>
            {error || "This project may have been removed."}
          </p>

          <button
            className="project-details__back-btn"
            onClick={() => navigate("/projects")}
          >
            ← Back to Projects
          </button>
        </div>
      </PageShell>
    );
  }

  const formattedDeadline = project.deadline
    ? new Date(project.deadline).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric"
        }
      )
    : "No deadline";

const teamMembers = project.teamMembers || [];

const teamCount =
  project.teamCount ?? teamMembers.length;

const isTeamFull =
  teamCount >= project.teamSize;

  return (
    <PageShell
      sidebarOpen={sidebarOpen}
      onSidebarOpen={() => setSidebarOpen(true)}
      onSidebarClose={() => setSidebarOpen(false)}
    >
      <div className="project-details">

        <Link
          to="/projects"
          className="project-details__back"
        >
          ← Back to Projects
        </Link>

        {/* Hero */}

        <section className="project-details__hero">

          <div className="project-details__hero-main">

            <span className="project-details__category">
              {project.category}
            </span>

            <h1>{project.title}</h1>

            <p className="project-details__description">
              {project.description}
            </p>

          </div>

          <div className="project-details__hero-meta">

            <span
              className={`project-details__status project-details__status--${project.status}`}
            >
              {project.status}
            </span>

            <span>
              Due {formattedDeadline}
            </span>

          </div>

        </section>

        {/* Main content */}

        <div className="project-details__layout">

          <main className="project-details__main">

            {/* About */}

            <section className="project-details__section">

              <h2>About this project</h2>

              <p>
                {project.description}
              </p>

            </section>

            {/* Skills */}

            <section className="project-details__section">

              <h2>Required skills</h2>

              <div className="project-details__skills">

                {(project.requiredSkills || []).map(
                  (skill) => (
                    <span key={skill}>
                      {skill}
                    </span>
                  )
                )}

              </div>

            </section>

            {/* Team */}

          <section className="project-details__section">

            <div className="project-details__section-header">

              <div>

                <h2>Current team</h2>

                <p>
                  {isTeamFull
                    ? "This project has reached its maximum team size."
                    : "See who's already working on this project."}
                </p>

              </div>

              <span className="project-details__team-count">
                {teamCount}/{project.teamSize}
              </span>

            </div>

            {teamMembers.length > 0 ? (

              <div className="project-details__team-list">

                {teamMembers.map((member, index) => {

                  const initials =
                    member?.name
                      ?.split(" ")
                      .map((name) => name[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "U";

                  const isOwner =
                    member?._id === project.owner?._id;

                  return (

                    <div
                      className="project-details__team-member"
                      key={member?._id || index}
                    >

                      <div className="project-details__team-avatar">
                        {initials}
                      </div>

                      <div className="project-details__team-member-info">

                        <div className="project-details__team-member-name">

                          <strong>
                            {member?.name || "Unknown student"}
                          </strong>

                          {isOwner && (
                            <span className="project-details__owner-badge">
                              Owner
                            </span>
                          )}

                        </div>

                        <span>
                          {member?.course || "Student"}

                          {member?.year
                            ? ` • ${member.year}`
                            : ""}
                        </span>

                      </div>

                    </div>

                  );
                })}

              </div>

            ) : (

              <div className="project-details__empty-team">

                <div>
                  +
                </div>

                <p>
                  This project is looking for teammates.
                </p>

              </div>

            )}

          </section>

          </main>

          {/* Sidebar */}

          <aside className="project-details__sidebar">

            <section className="project-details__owner">

              <p className="project-details__owner-label">
                PROJECT OWNER
              </p>

              <div className="project-details__owner-info">

                <div className="project-details__owner-avatar">
                  {project.owner?.name
                    ?.split(" ")
                    .map((name) => name[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "U"}
                </div>

                <div>

                  <strong>
                    {project.owner?.name ||
                      "Unknown student"}
                  </strong>

                  <span>
                    {project.owner?.course ||
                      "Student"}
                  </span>

                </div>

              </div>

            </section>

            <section className="project-details__info">

              <div>
                <span>Team size</span>

                <strong>
                  {project.teamSize} members
                </strong>
              </div>

              <div>
                <span>Current members</span>

                <strong>
                  {teamCount} members
                </strong>
              </div>

              <div>
                <span>Deadline</span>

                <strong>
                  {formattedDeadline}
                </strong>
              </div>

              <div>
                <span>Status</span>

                <strong>
                  {project.status}
                </strong>
              </div>

            </section>

            <button
              className="project-details__join-btn"
              type="button"
              onClick={openJoinModal}
              disabled={
                project.status !== "open" ||
                isTeamFull
              }
            >
              {project.status !== "open"
                ? "Project Closed"
                : isTeamFull
                  ? "Team Full"
                  : "Request to Join"}
            </button>

          </aside>

        </div>

      </div>

      {/* Join Modal */}

      {joinModalOpen && (
        <div
          className="project-details__modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !joinLoading
            ) {
              closeJoinModal();
            }
          }}
        >

          <div className="project-details__modal">

            {!joinSuccess ? (
              <>
                <div className="project-details__modal-header">

                  <div>

                    <p>
                      JOIN PROJECT
                    </p>

                    <h2>
                      Request to Join
                    </h2>

                  </div>

                  <button
                    type="button"
                    onClick={closeJoinModal}
                    disabled={joinLoading}
                    aria-label="Close"
                  >
                    ×
                  </button>

                </div>

                <div className="project-details__modal-project">

                  <span>
                    {project.category}
                  </span>

                  <strong>
                    {project.title}
                  </strong>

                </div>

                <form
                  className="project-details__join-form"
                  onSubmit={handleJoinRequest}
                >

                  <label htmlFor="joinMessage">
                    Introduce yourself
                    <span>Optional</span>
                  </label>

                  <textarea
                    id="joinMessage"
                    rows="5"
                    maxLength="500"
                    placeholder="Tell the project owner why you'd be a good fit..."
                    value={joinMessage}
                    onChange={(event) =>
                      setJoinMessage(event.target.value)
                    }
                    disabled={joinLoading}
                  />

                  <div className="project-details__character-count">
                    {joinMessage.length}/500
                  </div>

                  {joinError && (
                    <div className="project-details__join-error">
                      <span>!</span>
                      {joinError}
                    </div>
                  )}

                  <div className="project-details__modal-actions">

                    <button
                      type="button"
                      className="project-details__modal-cancel"
                      onClick={closeJoinModal}
                      disabled={joinLoading}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="project-details__modal-submit"
                      disabled={joinLoading}
                    >
                      {joinLoading ? (
                        <>
                          <span className="project-details__button-spinner"></span>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Request
                          <span>→</span>
                        </>
                      )}
                    </button>

                  </div>

                </form>
              </>
            ) : (
              <div className="project-details__join-success">

                <div className="project-details__join-success-icon">
                  ✓
                </div>

                <h2>
                  Request sent!
                </h2>

                <p>
                  Your request to join{" "}
                  <strong>{project.title}</strong>{" "}
                  has been sent to the project owner.
                </p>

                <button
                  type="button"
                  onClick={closeJoinModal}
                >
                  Done
                </button>

              </div>
            )}

          </div>

        </div>
      )}

    </PageShell>
  );
}

export default ProjectDetails;