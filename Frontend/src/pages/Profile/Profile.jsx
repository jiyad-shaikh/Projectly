import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageShell from "../../components/PageShell/PageShell";
import { useAuth } from "../../hooks/useAuth";
import { updateProfile, getProfileStats } from "../../services/auth.api";

import "./Profile.scss";

const allSkills = [
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
  "Figma",
  "HTML",
  "SCSS"
];

function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    course: "",
    year: "",
    bio: "",
    portfolio: "",
    skills: [],
    interests: [],
    createdAt: ""
  });

  const [formData, setFormData] = useState({
    name: "",
    course: "",
    year: "",
    bio: "",
    portfolio: "",
    skills: [],
    interests: []
  });

  const [customSkill, setCustomSkill] = useState("");
  const [showCustomSkillInput, setShowCustomSkillInput] = useState(false);

  const [stats, setStats] = useState({
  projects: 0,
  teammates: 0,
  requests: 0
});

const [statsLoading, setStatsLoading] = useState(true);

  /*
   * Load the authenticated user into the profile.
   */
  useEffect(() => {
    if (!user) {
      return;
    }

    const userProfile = {
      name: user.name || "",
      email: user.email || "",
      course: user.course || "",
      year: user.year || "",
      bio: user.bio || "",
      portfolio: user.portfolio || "",
      skills: Array.isArray(user.skills) ? user.skills : [],
      interests: Array.isArray(user.interests) ? user.interests : [],
      createdAt: user.createdAt || ""
    };

    setProfile(userProfile);

    setFormData({
      name: userProfile.name,
      course: userProfile.course,
      year: userProfile.year,
      bio: userProfile.bio,
      portfolio: userProfile.portfolio,
      skills: [...userProfile.skills],
      interests: [...userProfile.interests]
    });
  }, [user]);

  useEffect(() => {
  const loadProfileStats = async () => {
    try {
      setStatsLoading(true);

      const response = await getProfileStats();

      setStats(response.stats);
    } catch (error) {
      console.error("Failed to load profile stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  loadProfileStats();
}, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const toggleSkill = (skill) => {
  setFormData((previous) => {
    const exists = previous.skills.includes(skill);

    if (exists) {
      return {
        ...previous,
        skills: previous.skills.filter((item) => item !== skill)
      };
    }

    if (previous.skills.length >= 4) {
      setError("You can select up to 4 skills.");
      return previous;
    }

    return {
      ...previous,
      skills: [...previous.skills, skill]
    };
  });

  setError("");
};

  const addCustomSkill = () => {
    const skill = customSkill.trim();

    if (!skill) return;

    if (formData.skills.length >= 4) {
      setError("You can select up to 4 skills.");
      return;
    }

    const alreadyExists = formData.skills.some(
      (item) => item.toLowerCase() === skill.toLowerCase()
    );

    if (alreadyExists) {
      setError("This skill has already been added.");
      return;
    }

    setFormData((previous) => ({
      ...previous,
      skills: [...previous.skills, skill]
    }));

    setCustomSkill("");
    setShowCustomSkillInput(false);
    setError("");
  };
  const removeSkill = (skill) => {
    setFormData((previous) => ({
      ...previous,
      skills: previous.skills.filter((item) => item !== skill)
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSaved(false);

      const response = await updateProfile({
        name: formData.name,
        course: formData.course,
        year: formData.year,
        bio: formData.bio,
        portfolio: formData.portfolio,
        skills: formData.skills,
        interests: formData.interests
      });

      const updatedUser = response.user;

      setProfile({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        course: updatedUser.course || "",
        year: updatedUser.year || "",
        bio: updatedUser.bio || "",
        portfolio: updatedUser.portfolio || "",
        skills: Array.isArray(updatedUser.skills)
          ? updatedUser.skills
          : [],
        interests: Array.isArray(updatedUser.interests)
          ? updatedUser.interests
          : [],
        createdAt: updatedUser.createdAt || ""
      });

      setFormData({
        name: updatedUser.name || "",
        course: updatedUser.course || "",
        year: updatedUser.year || "",
        bio: updatedUser.bio || "",
        portfolio: updatedUser.portfolio || "",
        skills: Array.isArray(updatedUser.skills)
          ? [...updatedUser.skills]
          : [],
        interests: Array.isArray(updatedUser.interests)
          ? [...updatedUser.interests]
          : []
      });

      // Update the global authenticated user.
      updateUser(updatedUser);

      setEditing(false);
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);

    } catch (error) {
      console.error("Failed to update profile:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
  setFormData({
    name: profile.name,
    course: profile.course,
    year: profile.year,
    bio: profile.bio,
    portfolio: profile.portfolio,
    skills: [...profile.skills],
    interests: [...profile.interests]
  });

  setCustomSkill("");
  setShowCustomSkillInput(false);

  setError("");
  setEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) {
      return "U";
    }

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatMemberSince = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    });
  };

  return (
    <PageShell
      sidebarOpen={sidebarOpen}
      onSidebarOpen={() => setSidebarOpen(true)}
      onSidebarClose={() => setSidebarOpen(false)}
    >
      <div className="profile-page">

        {/* Header */}
        <header className="profile-page__header">
          <div>
            <p className="profile-page__eyebrow">
              YOUR PROFILE
            </p>

            <h1>Profile</h1>

            <p className="profile-page__subtitle">
              Keep your profile updated so students can discover you
              for their projects.
            </p>
          </div>

          {!editing && (
            <button
              type="button"
              className="profile-page__edit-btn"
              onClick={() => {
                setError("");
                setEditing(true);
              }}
            >
              Edit Profile
              <span>✎</span>
            </button>
          )}
        </header>

        {/* Saved Message */}
        {saved && (
          <div className="profile-page__saved">
            <span>✓</span>
            Profile updated successfully.
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="profile-page__saved profile-page__saved--error">
            <span>!</span>
            {error}
          </div>
        )}

        {/* Main Layout */}
        <div className="profile-page__layout">

          {/* Main Profile */}
          <section className="profile-page__content">

            {/* Identity Card */}
            <div className="profile-page__card profile-page__identity-card">

              <div className="profile-page__identity">

                <div className="profile-page__avatar">
                  {getInitials(profile.name)}
                </div>

                <div className="profile-page__identity-info">
                  <h2>{profile.name || "Student"}</h2>

                  <p>
                    {profile.course || "Course"} •{" "}
                    {profile.year || "Year"}
                  </p>

                  <span>
                    Student
                  </span>
                </div>

              </div>

              <div className="profile-page__member">
                <span>MEMBER SINCE</span>
                <strong>
                  {formatMemberSince(profile.createdAt)}
                </strong>
              </div>

            </div>

            {/* About */}
            <div className="profile-page__card">

              <div className="profile-page__section-heading">

                <div className="profile-page__section-icon">
                  ✦
                </div>

                <div>
                  <h2>About You</h2>

                  <p>
                    Tell other students a little about yourself.
                  </p>
                </div>

              </div>

              {editing ? (
                <form
                  className="profile-page__form"
                  onSubmit={handleSave}
                >

                  <div className="profile-page__fields">

                    <div className="profile-page__field">
                      <label htmlFor="name">
                        Full Name
                      </label>

                      <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="profile-page__field">
                      <label htmlFor="email">
                        Email
                      </label>

                      <input
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled
                      />

                      <small>
                        Email cannot be changed.
                      </small>
                    </div>

                    <div className="profile-page__field">
                      <label htmlFor="course">
                        Course
                      </label>

                      <input
                        id="course"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="profile-page__field">
                      <label htmlFor="year">
                        Year
                      </label>

                      <select
                        id="year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                      >
                        <option>First Year</option>
                        <option>Second Year</option>
                        <option>Third Year</option>
                        <option>Final Year</option>
                      </select>
                    </div>

                    <div className="profile-page__field full">
                      <label htmlFor="bio">
                        Bio
                      </label>

                      <textarea
                        id="bio"
                        name="bio"
                        rows="4"
                        maxLength="300"
                        value={formData.bio}
                        onChange={handleChange}
                      />

                      <small>
                        {formData.bio.length}/300 characters
                      </small>
                    </div>

                    <div className="profile-page__field full">
                      <label htmlFor="portfolio">
                        Portfolio / GitHub
                      </label>

                      <input
                        id="portfolio"
                        name="portfolio"
                        type="url"
                        placeholder="https://github.com/username"
                        value={formData.portfolio}
                        onChange={handleChange}
                      />
                    </div>

                  </div>

                  <div className="profile-page__form-actions">

                    <button
                      type="button"
                      className="secondary"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                      {!saving && <span>→</span>}
                    </button>

                  </div>

                </form>
              ) : (
                <div className="profile-page__about">

                  <p>
                    {profile.bio || "No bio added yet."}
                  </p>

                  <div className="profile-page__details">

                    <div>
                      <span>EMAIL</span>
                      <strong>{profile.email}</strong>
                    </div>

                    <div>
                      <span>COURSE</span>
                      <strong>{profile.course}</strong>
                    </div>

                    <div>
                      <span>YEAR</span>
                      <strong>{profile.year}</strong>
                    </div>

                    <div>
                      <span>PORTFOLIO</span>

                      {profile.portfolio ? (
                        <a
                          href={profile.portfolio}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Portfolio →
                        </a>
                      ) : (
                        <strong>Not added</strong>
                      )}
                    </div>

                  </div>

                </div>
              )}

            </div>

            {/* Skills */}
            <div className="profile-page__card">

              <div className="profile-page__section-heading">

                <div className="profile-page__section-icon">
                  #
                </div>

                <div>
                  <h2>Your Skills</h2>

                  <p>
                    Skills help project owners find the right teammates.
                  </p>
                </div>

              </div>

              <div className="profile-page__skills">

                {(editing
                  ? formData.skills
                  : profile.skills
                ).map((skill) => (
                  <div
                    className="profile-page__skill"
                    key={skill}
                  >
                    {skill}

                    {editing && (
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        aria-label={`Remove ${skill}`}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}

                {!editing && profile.skills.length === 0 && (
                  <p>No skills added yet.</p>
                )}

              </div>

              {editing && (
                <>
                  <div className="profile-page__skills-divider">
                    <span>Add skills</span>
                    <small>{formData.skills.length}/4</small>
                  </div>

                  <div className="profile-page__available-skills">

                    {/* PREDEFINED SKILLS */}
                    {allSkills.map((skill) => {
                      const selected = formData.skills.includes(skill);

                      return (
                        <button
                          key={skill}
                          type="button"
                          className={selected ? "selected" : ""}
                          onClick={() => toggleSkill(skill)}
                        >
                          {selected && <span>✓</span>}
                          {skill}
                        </button>
                      );
                    })}

                    {/* CUSTOM SKILLS */}
                    {formData.skills
                      .filter((skill) => !allSkills.includes(skill))
                      .map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          className="selected"
                          onClick={() => toggleSkill(skill)}
                        >
                          <span>✓</span>
                          {skill}
                        </button>
                      ))}

                    {/* ADD CUSTOM SKILL */}
                    {formData.skills.length < 4 && !showCustomSkillInput && (
                      <button
                        type="button"
                        className="profile-page__custom-skill-btn"
                        onClick={() => setShowCustomSkillInput(true)}
                      >
                        <span>+</span>
                        Add skill
                      </button>
                    )}

                  </div>

                  {/* CUSTOM SKILL INPUT */}
                  {showCustomSkillInput && (
                    <div className="profile-page__custom-skill">

                      <input
                        type="text"
                        placeholder="Enter a skill, e.g. Docker"
                        value={customSkill}
                        onChange={(event) => {
                          setCustomSkill(event.target.value);
                          setError("");
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addCustomSkill();
                          }
                        }}
                        autoFocus
                      />

                      <button
                        type="button"
                        onClick={addCustomSkill}
                      >
                        Add
                      </button>

                      <button
                        type="button"
                        className="profile-page__custom-skill-cancel"
                        onClick={() => {
                          setCustomSkill("");
                          setShowCustomSkillInput(false);
                        }}
                      >
                        Cancel
                      </button>

                    </div>
                  )}
                </>
              )}

            </div>

            {/* Logout */}
            <div className="profile-page__logout-section">

              <div className="profile-page__logout-info">
                <h3>Sign out</h3>

                <p>
                  Sign out of your Projectly account on this device.
                </p>
              </div>

              <button
                type="button"
                className="profile-page__logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>

          </section>

          {/* Right Side */}
          <aside className="profile-page__aside">

            {/* Activity */}
            <div className="profile-page__card profile-page__stats-card">

              <p className="profile-page__card-label">
                YOUR ACTIVITY
              </p>

              <div className="profile-page__stats">
                <div>
                  <strong>
                    {statsLoading ? "—" : stats.projects}
                  </strong>
                  <span>Projects</span>
                </div>

                <div>
                  <strong>
                    {statsLoading ? "—" : stats.teammates}
                  </strong>
                  <span>Teammates</span>
                </div>

                <div>
                  <strong>
                    {statsLoading ? "—" : stats.requests}
                  </strong>
                  <span>Requests</span>
                </div>
              </div>

            </div>

            {/* Tips */}
            <div className="profile-page__card profile-page__tips">

              <div className="profile-page__tips-icon">
                ✦
              </div>

              <h3>Build a stronger profile</h3>

              <p>
                Adding more relevant skills and a short bio helps
                other students understand what you can contribute
                to their projects.
              </p>

              <Link to="/projects">
                Explore Projects →
              </Link>

            </div>

          </aside>

        </div>

      </div>
    </PageShell>
  );
}

export default Profile;

