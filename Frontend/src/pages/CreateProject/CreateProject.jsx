import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageShell from "../../components/PageShell/PageShell";
import { createProject } from "../../services/project.api";

import "./CreateProject.scss";

const categories = [
  "Web Development",
  "Full Stack",
  "AI / ML",
  "Mobile",
  "Design",
  "Other"
];

const availableSkills = [
  "React",
  "JavaScript",
  "Node.js",
  "Express",
  "MongoDB",
  "Python",
  "AI",
  "Machine Learning",
  "Flutter",
  "Firebase",
  "UI/UX",
  "Figma"
];

function CreateProject() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    teamSize: "4",
    deadline: ""
  });

  const [selectedSkills, setSelectedSkills] = useState([]);

  const [created, setCreated] = useState(false);
  const [createdProjectId, setCreatedProjectId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    // Remove previous error when user starts editing again
    if (error) {
      setError("");
    }
  };

  const toggleSkill = (skill) => {
    setSelectedSkills((previous) => {
      if (previous.includes(skill)) {
        return previous.filter((item) => item !== skill);
      }

      return [...previous, skill];
    });

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // Frontend validation
    if (selectedSkills.length === 0) {
      setError("Please select at least one required skill.");
      return;
    }

    try {
      setLoading(true);

      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        requiredSkills: selectedSkills,
        teamSize: Number(formData.teamSize),
        deadline: formData.deadline
      };

      const data = await createProject(projectData);

      console.log("Project created:", data);

      setCreatedProjectId(data.project?._id || null);
      setCreated(true);

    } catch (error) {
      console.error("Create project error:", error);

      setError(
        error.response?.data?.message ||
        "Unable to create project. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnother = () => {
    setCreated(false);
    setCreatedProjectId(null);

    setFormData({
      title: "",
      description: "",
      category: "",
      teamSize: "4",
      deadline: ""
    });

    setSelectedSkills([]);
    setError("");
  };

  return (
    <PageShell
      sidebarOpen={sidebarOpen}
      onSidebarOpen={() => setSidebarOpen(true)}
      onSidebarClose={() => setSidebarOpen(false)}
    >
      <div className="create-project-page">

        {/* Top */}

        <div className="create-project-page__topbar">
          <Link
            to="/dashboard"
            className="create-project-page__back"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Heading */}

        <header className="create-project-page__header">
          <div>
            <p className="create-project-page__eyebrow">
              START SOMETHING NEW
            </p>

            <h1>Create a Project</h1>

            <p>
              Tell other students what you're building and find
              the right teammates to bring it to life.
            </p>
          </div>
        </header>

        {/* Error */}

        {error && !created && (
          <div className="create-project-page__error">
            <span>!</span>
            <p>{error}</p>
          </div>
        )}

        {created ? (
          <section className="create-project-page__success">

            <div className="create-project-page__success-icon">
              ✓
            </div>

            <h2>Project created successfully!</h2>

            <p>
              Your project is now visible to students looking
              for project opportunities.
            </p>

            <div className="create-project-page__success-actions">

              {createdProjectId && (
                <button
                  onClick={() =>
                    navigate(`/projects/${createdProjectId}`)
                  }
                >
                  View Project
                </button>
              )}

              <button
                onClick={() => navigate("/projects")}
              >
                Browse Projects
              </button>

              <button
                className="secondary"
                onClick={handleCreateAnother}
              >
                Create Another
              </button>

            </div>

          </section>
        ) : (
          <form
            className="create-project-page__form"
            onSubmit={handleSubmit}
          >

            {/* Basic Information */}

            <section className="create-project-page__card">

              <div className="create-project-page__section-heading">

                <div className="create-project-page__section-number">
                  01
                </div>

                <div>
                  <h2>Project Information</h2>

                  <p>
                    Start with the basics of your project.
                  </p>
                </div>

              </div>

              <div className="create-project-page__fields">

                <div className="create-project-page__field full">

                  <label htmlFor="title">
                    Project Name
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="e.g. Smart Campus App"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />

                  <span>
                    Give your project a clear and memorable name.
                  </span>

                </div>

                <div className="create-project-page__field full">

                  <label htmlFor="description">
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows="5"
                    placeholder="What are you building? What problem does it solve?"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />

                  <span>
                    Explain your idea so potential teammates understand it.
                  </span>

                </div>

                <div className="create-project-page__field">

                  <label htmlFor="category">
                    Category
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>

                </div>

                <div className="create-project-page__field">

                  <label htmlFor="teamSize">
                    Team Size
                  </label>

                  <select
                    id="teamSize"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleChange}
                  >
                    <option value="2">2 members</option>
                    <option value="3">3 members</option>
                    <option value="4">4 members</option>
                    <option value="5">5 members</option>
                    <option value="6">6 members</option>
                  </select>

                </div>

                <div className="create-project-page__field full">

                  <label htmlFor="deadline">
                    Project Deadline
                  </label>

                  <input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

            </section>

            {/* Skills */}

            <section className="create-project-page__card">

              <div className="create-project-page__section-heading">

                <div className="create-project-page__section-number">
                  02
                </div>

                <div>

                  <h2>Required Skills</h2>

                  <p>
                    Choose the skills you'd like your teammates to have.
                  </p>

                </div>

              </div>

              <div className="create-project-page__skills">

                {availableSkills.map((skill) => {

                  const selected =
                    selectedSkills.includes(skill);

                  return (
                    <button
                      type="button"
                      key={skill}
                      className={
                        selected
                          ? "create-project-page__skill active"
                          : "create-project-page__skill"
                      }
                      onClick={() => toggleSkill(skill)}
                    >

                      {selected && (
                        <span className="check">
                          ✓
                        </span>
                      )}

                      {skill}

                    </button>
                  );

                })}

              </div>

              <div className="create-project-page__selected">

                <span>
                  {selectedSkills.length} skills selected
                </span>

                {selectedSkills.length === 0 && (
                  <small>
                    Select at least one skill
                  </small>
                )}

              </div>

            </section>

            {/* Preview */}

            <section className="create-project-page__preview">

              <div>

                <p className="create-project-page__preview-label">
                  QUICK PREVIEW
                </p>

                <h3>
                  {formData.title || "Your Project Name"}
                </h3>

                <p>
                  {formData.description ||
                    "Your project description will appear here."}
                </p>

                <div className="create-project-page__preview-tags">

                  {selectedSkills.length > 0
                    ? selectedSkills.slice(0, 4).map((skill) => (
                        <span key={skill}>
                          {skill}
                        </span>
                      ))
                    : (
                      <>
                        <span>React</span>
                        <span>Node.js</span>
                        <span>UI/UX</span>
                      </>
                    )}

                </div>

              </div>

              <div className="create-project-page__preview-meta">

                <div>
                  <span>Team</span>

                  <strong>
                    {formData.teamSize}
                  </strong>
                </div>

                <div>
                  <span>Deadline</span>

                  <strong>
                    {formData.deadline || "Not set"}
                  </strong>
                </div>

              </div>

            </section>

            {/* Submit */}

            <div className="create-project-page__actions">

              <Link to="/projects">
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="create-project-page__button-spinner"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    Create Project
                    <span>→</span>
                  </>
                )}
              </button>

            </div>

          </form>
        )}

      </div>
    </PageShell>
  );
}

export default CreateProject;