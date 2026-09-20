import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageShell from "../../components/PageShell/PageShell";
import {
  getReceivedRequests,
  getSentRequests,
  acceptJoinRequest,
  rejectJoinRequest,
} from "../../services/request.api";

import "./Requests.scss";

const tabs = ["All", "Pending", "Accepted", "Rejected"];

function formatRequestedAt(date) {
  if (!date) return "Recently";

  const now = new Date();
  const requestedDate = new Date(date);

  const difference = now - requestedDate;
  const minutes = Math.floor(difference / (1000 * 60));
  const hours = Math.floor(difference / (1000 * 60 * 60));
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return requestedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function Requests() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("All");
  const [activeStatusTab, setActiveStatusTab] = useState("All");

  const [sentRequests, setSentRequests] = useState([]);
  const [sentLoading, setSentLoading] = useState(false);
  const [sentError, setSentError] = useState("");

  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [processingId, setProcessingId] = useState(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getReceivedRequests();

      setRequests(data.requests || []);
    } catch (error) {
      console.error("Failed to load requests:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load team requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const loadSentRequests = async () => {
  try {
    setSentLoading(true);
    setSentError("");

    const data = await getSentRequests();

    setSentRequests(data.requests || []);
  } catch (error) {
    console.error("Failed to fetch sent requests:", error);

    setSentError(
      error.response?.data?.message ||
        "Unable to load your requests."
    );
  } finally {
    setSentLoading(false);
  }
  };

  useEffect(() => {
    if (activeTab === "sent") {
      loadSentRequests();
    }
  }, [activeTab]);

  const handleStatusChange = async (requestId, status) => {
    try {
      setProcessingId(requestId);
      setError("");

      if (status === "Accepted") {
        await acceptJoinRequest(requestId);
      } else {
        await rejectJoinRequest(requestId);
      }

      setRequests((previous) =>
        previous.map((request) =>
          request._id === requestId
            ? {
                ...request,
                status: status.toLowerCase()
              }
            : request
        )
      );
    } catch (error) {
      console.error("Failed to update request:", error);

      setError(
        error.response?.data?.message ||
          `Unable to ${status.toLowerCase()} this request.`
      );
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRequests =
  activeStatusTab === "All"
    ? requests
    : requests.filter(
        (request) =>
          request.status?.toLowerCase() ===
          activeStatusTab.toLowerCase()
      );

  const pendingCount = requests.filter(
    (request) => request.status === "pending"
  ).length;

  return (
  <PageShell
    sidebarOpen={sidebarOpen}
    onSidebarOpen={() => setSidebarOpen(true)}
    onSidebarClose={() => setSidebarOpen(false)}
  >
    <div className="requests-page">

      {/* Header */}
      <header className="requests-page__header">
        <div>
          <p className="requests-page__eyebrow">
            TEAM MANAGEMENT
          </p>

          <h1>Team Requests</h1>

          <p className="requests-page__subtitle">
            Review students who want to join your projects and
            track the requests you've sent.
          </p>
        </div>

        <div className="requests-page__header-stat">
          <span>
            {activeTab === "received"
              ? pendingCount
              : sentRequests.filter(
                  (request) => request.status === "pending"
                ).length}
          </span>

          <small>
            {activeTab === "received"
              ? "Pending requests"
              : "Pending applications"}
          </small>
        </div>
      </header>

      {/* Main Request Type Tabs */}
      <div className="requests-page__main-tabs">

        <button
          className={
            activeTab === "received"
              ? "requests-page__main-tab active"
              : "requests-page__main-tab"
          }
          onClick={() => setActiveTab("received")}
        >
          <span className="requests-page__main-tab-icon">
            ↓
          </span>

          <span>
            <strong>Received Requests</strong>
            <small>
              Students requesting to join your projects
            </small>
          </span>

          {pendingCount > 0 && (
            <span className="requests-page__main-tab-count">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          className={
            activeTab === "sent"
              ? "requests-page__main-tab active"
              : "requests-page__main-tab"
          }
          onClick={() => setActiveTab("sent")}
        >
          <span className="requests-page__main-tab-icon">
            ↑
          </span>

          <span>
            <strong>My Requests</strong>
            <small>
              Projects you've requested to join
            </small>
          </span>

          {sentRequests.filter(
            (request) => request.status === "pending"
          ).length > 0 && (
            <span className="requests-page__main-tab-count">
              {
                sentRequests.filter(
                  (request) => request.status === "pending"
                ).length
              }
            </span>
          )}
        </button>

      </div>

      {/* Received Requests */}
      {activeTab === "received" && (
        <>
          {/* Status Tabs */}
          <div className="requests-page__tabs">

            {tabs.map((tab) => {
              const count =
                tab === "All"
                  ? requests.length
                  : requests.filter(
                      (request) =>
                        request.status?.toLowerCase() ===
                        tab.toLowerCase()
                    ).length;

              return (
                <button
                  key={tab}
                  className={
                    activeStatusTab === tab
                      ? "requests-page__tab active"
                      : "requests-page__tab"
                  }
                  onClick={() => setActiveStatusTab(tab)}
                >
                  {tab}
                  <span>{count}</span>
                </button>
              );
            })}

          </div>

          {/* Error */}
          {error && (
            <div className="requests-page__error">
              <span>{error}</span>

              <button onClick={loadRequests}>
                Try again
              </button>
            </div>
          )}

          {/* Received Requests Content */}
          <section className="requests-page__content">

            <div className="requests-page__section-heading">
              <div>
                <h2>
                  {activeStatusTab === "All"
                    ? "All Requests"
                    : `${activeStatusTab} Requests`}
                </h2>

                <p>
                  {loading
                    ? "Loading requests..."
                    : `${filteredRequests.length} request${
                        filteredRequests.length !== 1
                          ? "s"
                          : ""
                      } found`}
                </p>
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="requests-page__empty">

                <div className="requests-page__empty-icon">
                  ◌
                </div>

                <h3>Loading requests...</h3>

                <p>
                  Fetching the latest team requests.
                </p>

              </div>

            ) : filteredRequests.length > 0 ? (

              <div className="requests-page__list">

                {filteredRequests.map((request) => {

                  const applicant = request.user || {};
                  const project = request.project || {};

                  const initials =
                    applicant.name
                      ?.split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "U";

                  const status =
                    request.status
                      ? request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)
                      : "Pending";

                  const isProcessing =
                    processingId === request._id;

                  return (
                    <article
                      className="request-card"
                      key={request._id}
                    >

                      {/* Profile */}
                      <div className="request-card__top">

                        <div className="request-card__profile">

                          <div className="request-card__avatar">
                            {initials}
                          </div>

                          <div>
                            <h3>
                              {applicant.name ||
                                "Unknown Student"}
                            </h3>

                            <p>
                              {applicant.course
                                ? `${applicant.course} • ${
                                    applicant.year || ""
                                  }`
                                : "College Student"}
                            </p>
                          </div>

                        </div>

                        <div
                          className={`request-card__status request-card__status--${request.status}`}
                        >
                          <span></span>
                          {status}
                        </div>

                      </div>

                      {/* Project */}
                      <div className="request-card__project">

                        <div className="request-card__project-icon">
                          ◫
                        </div>

                        <div>
                          <span>WANTS TO JOIN</span>

                          <strong>
                            {project.title || "Project"}
                          </strong>
                        </div>

                        <div className="request-card__category">
                          {project.category || "Project"}
                        </div>

                      </div>

                      {/* Skills */}
                      <div className="request-card__skills">

                        {(applicant.skills || []).length > 0 ? (
                          applicant.skills.map((skill) => (
                            <span key={skill}>
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span>No skills added</span>
                        )}

                      </div>

                      {/* Message */}
                      {request.message && (
                        <p className="request-card__message">
                          "{request.message}"
                        </p>
                      )}

                      {/* Bottom */}
                      <div className="request-card__bottom">

                        <span className="request-card__time">
                          Requested{" "}
                          {formatRequestedAt(
                            request.createdAt ||
                              request.requestedAt
                          )}
                        </span>

                        {request.status === "pending" ? (

                          <div className="request-card__actions">

                            <button
                              className="request-card__reject"
                              disabled={isProcessing}
                              onClick={() =>
                                handleStatusChange(
                                  request._id,
                                  "Rejected"
                                )
                              }
                            >
                              {isProcessing
                                ? "Updating..."
                                : "Reject"}
                            </button>

                            <button
                              className="request-card__accept"
                              disabled={isProcessing}
                              onClick={() =>
                                handleStatusChange(
                                  request._id,
                                  "Accepted"
                                )
                              }
                            >
                              {isProcessing
                                ? "Updating..."
                                : "Accept"}

                              {!isProcessing && (
                                <span>→</span>
                              )}
                            </button>

                          </div>

                        ) : (

                          <Link
                            to={`/projects/${project._id}`}
                            className="request-card__view"
                          >
                            View Project →
                          </Link>

                        )}

                      </div>

                    </article>
                  );
                })}

              </div>

            ) : (

              <div className="requests-page__empty">

                <div className="requests-page__empty-icon">
                  ♢
                </div>

                <h3>
                  No {activeStatusTab.toLowerCase()} requests
                </h3>

                <p>
                  There are no requests in this category right now.
                </p>

                {activeStatusTab !== "All" && (
                  <button
                    onClick={() => setActiveStatusTab("All")}
                  >
                    View all requests
                  </button>
                )}

              </div>

            )}

          </section>
        </>
      )}

      {/* My Sent Requests */}
      {activeTab === "sent" && (
        <>
          {sentError && (
            <div className="requests-page__error">
              <span>{sentError}</span>

              <button onClick={loadSentRequests}>
                Try again
              </button>
            </div>
          )}

          <section className="requests-page__content">

            <div className="requests-page__section-heading">
              <div>
                <h2>My Requests</h2>

                <p>
                  {sentLoading
                    ? "Loading your requests..."
                    : `${sentRequests.length} request${
                        sentRequests.length !== 1
                          ? "s"
                          : ""
                      } sent`}
                </p>
              </div>
            </div>

            {/* Loading */}
            {sentLoading ? (

              <div className="requests-page__empty">

                <div className="requests-page__empty-icon">
                  ◌
                </div>

                <h3>Loading your requests...</h3>

                <p>
                  Checking the latest status of your applications.
                </p>

              </div>

            ) : sentRequests.length > 0 ? (

              <div className="requests-page__list">

                {sentRequests.map((request) => {

                  const project = request.project || {};
                  const owner = project.owner || {};

                  const status =
                    request.status
                      ? request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)
                      : "Pending";

                  const initials =
                    owner.name
                      ?.split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "U";

                  return (
                    <article
                      className="request-card request-card--sent"
                      key={request._id}
                    >

                      {/* Project / Owner */}
                      <div className="request-card__top">

                        <div className="request-card__profile">

                          <div className="request-card__avatar">
                            {initials}
                          </div>

                          <div>
                            <h3>
                              {project.title ||
                                "Untitled Project"}
                            </h3>

                            <p>
                              {owner.name
                                ? `Owned by ${owner.name}`
                                : "Project Owner"}
                            </p>
                          </div>

                        </div>

                        <div
                          className={`request-card__status request-card__status--${request.status}`}
                        >
                          <span></span>
                          {status}
                        </div>

                      </div>

                      {/* Project Info */}
                      <div className="request-card__project">

                        <div className="request-card__project-icon">
                          ◫
                        </div>

                        <div>
                          <span>PROJECT</span>

                          <strong>
                            {project.title ||
                              "Untitled Project"}
                          </strong>
                        </div>

                        <div className="request-card__category">
                          {project.category ||
                            "Project"}
                        </div>

                      </div>

                      {/* Request Message */}
                      {request.message && (
                        <p className="request-card__message">
                          "{request.message}"
                        </p>
                      )}

                      {/* Request Details */}
                      <div className="request-card__sent-details">

                        <div>
                          <span>Team Size</span>
                          <strong>
                            {project.teamSize || "-"}
                          </strong>
                        </div>

                        <div>
                          <span>Deadline</span>
                          <strong>
                            {project.deadline
                              ? new Date(
                                  project.deadline
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                  }
                                )
                              : "-"}
                          </strong>
                        </div>

                      </div>

                      {/* Bottom */}
                      <div className="request-card__bottom">

                        <span className="request-card__time">
                          Requested{" "}
                          {formatRequestedAt(
                            request.createdAt ||
                              request.requestedAt
                          )}
                        </span>

                        <Link
                          to={`/projects/${project._id}`}
                          className="request-card__view"
                        >
                          View Project →
                        </Link>

                      </div>

                    </article>
                  );
                })}

              </div>

            ) : (

              <div className="requests-page__empty">

                <div className="requests-page__empty-icon">
                  ↑
                </div>

                <h3>No requests sent yet</h3>

                <p>
                  When you request to join a project,
                  your application status will appear here.
                </p>

                <Link
                  to="/projects"
                  className="requests-page__empty-action"
                >
                  Browse Projects →
                </Link>

              </div>

            )}

          </section>
        </>
      )}

    </div>
  </PageShell>
);
}

export default Requests;