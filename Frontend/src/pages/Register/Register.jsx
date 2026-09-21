import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import ParticlesBackground from "../../components/ParticlesBackground/ParticlesBackground"; 
import "./Register.scss";
import { useAuth } from "../../hooks/useAuth";

const skillOptions = [
  "React",
  "JavaScript",
  "Node.js",
  "Python",
  "MongoDB",
  "UI/UX",
  "Figma",
  "AI / ML"
];

function Register() {
  const { register } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    year: "",
    password: "",
    confirmPassword: ""
  });

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState("");
  const [showCustomSkillInput, setShowCustomSkillInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    setError("");
  };

  const toggleSkill = (skill) => {
    setSelectedSkills((previous) => {
      if (previous.includes(skill)) {
        return previous.filter((item) => item !== skill);
      }

      if (previous.length >= 4) {
        return previous;
      }

      return [...previous, skill];
    });

    setError("");
  };

  const addCustomSkill = () => {
  const skill = customSkill.trim();

  if (!skill) {
    return;
  }

  if (selectedSkills.length >= 4) {
    setError("You can select up to 4 skills.");
    return;
  }

  const alreadyExists = selectedSkills.some(
    (item) => item.toLowerCase() === skill.toLowerCase()
  );

  if (alreadyExists) {
    setError("This skill has already been added.");
    return;
  }

  setSelectedSkills((previous) => [...previous, skill]);

  setCustomSkill("");
  setShowCustomSkillInput(false);
  setError("");
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  if (formData.password.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  if (selectedSkills.length === 0) {
    setError("Please select at least one skill.");
    return;
  }

  try {
    setError("");

    await register({
      name: formData.name,
      email: formData.email,
      course: formData.course,
      year: formData.year,
      password: formData.password,
      skills: selectedSkills
    });

    navigate("/dashboard");
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Unable to create account. Please try again.";

    setError(message);
  }
};

  return (
    <div className="register-page">
      <ParticlesBackground />
      <div className="register-page__glow register-page__glow--one"></div>
      <div className="register-page__glow register-page__glow--two"></div>

      <div className="register-page__layout">

        {/* LEFT VISUAL PANEL */}
        <section className="register-page__visual">

          <Link to="/" className="register-page__brand">
            <div className="register-page__brand-mark">P</div>

            <div>
              <strong>Projectly</strong>
              <span>Partner Finder</span>
            </div>
          </Link>

          <div className="register-page__visual-content">

            <div className="register-page__eyebrow">
              YOUR NEXT PROJECT STARTS HERE
            </div>

            <h1>
              Build your team.
              <span>Build something great.</span>
            </h1>

            <p>
              Create your student profile, showcase your skills, and connect
              with people who can turn your project idea into reality.
            </p>

            <div className="register-page__features">

              <div className="register-page__feature">
                <div className="register-page__feature-icon">✦</div>
                <div>
                  <strong>Showcase your skills</strong>
                  <span>Help project owners discover what you can contribute.</span>
                </div>
              </div>

              <div className="register-page__feature">
                <div className="register-page__feature-icon">◫</div>
                <div>
                  <strong>Discover projects</strong>
                  <span>Find projects that match your interests and abilities.</span>
                </div>
              </div>

              <div className="register-page__feature">
                <div className="register-page__feature-icon">◎</div>
                <div>
                  <strong>Build together</strong>
                  <span>Collaborate with students and create something meaningful.</span>
                </div>
              </div>

            </div>
          </div>

          <div className="register-page__visual-footer">
            <span>© 2026 Projectly</span>
            <span>Made for college teams</span>
          </div>
        </section>

        {/* FORM PANEL */}
        <section className="register-page__form-section">

          <div className="register-page__theme-toggle">
            <ThemeToggle />
          </div>

          <div className="register-page__mobile-brand">
            <Link to="/" className="register-page__brand">
              <div className="register-page__brand-mark">P</div>
              <strong>Projectly</strong>
            </Link>
          </div>

          <div className="register-page__form-wrapper">

            <div className="register-page__form-header">
              <p>GET STARTED</p>

              <h2>Create your account</h2>

              <span>
                Join Projectly and start finding the right teammates.
              </span>
            </div>

            {error && (
              <div className="register-page__error">
                <span>!</span>
                {error}
              </div>
            )}

            <form
              className="register-page__form"
              onSubmit={handleSubmit}
            >

              {/* NAME + EMAIL */}
              <div className="register-page__row">

                <div className="register-page__field">
                  <label htmlFor="name">Full Name</label>

                  <div className="register-page__input-wrapper">
                    <span className="register-page__input-icon">◎</span>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Jiyad Shaikh"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="register-page__field">
                  <label htmlFor="email">Email Address</label>

                  <div className="register-page__input-wrapper">
                    <span className="register-page__input-icon">@</span>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

              </div>

              {/* COURSE + YEAR */}
              <div className="register-page__row">

                <div className="register-page__field">
                  <label htmlFor="course">Course</label>

                  <div className="register-page__input-wrapper">
                    <span className="register-page__input-icon">▣</span>

                    <input
                      id="course"
                      name="course"
                      type="text"
                      placeholder="BSc Information Technology"
                      value={formData.course}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="register-page__field">
                  <label htmlFor="year">Year</label>

                  <div className="register-page__input-wrapper">
                    <span className="register-page__input-icon">◫</span>

                    <select
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select year</option>
                      <option value="First Year">First Year</option>
                      <option value="Second Year">Second Year</option>
                      <option value="Third Year">Third Year</option>
                      <option value="Final Year">Final Year</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* PASSWORD */}
              <div className="register-page__field">
                <label htmlFor="password">Password</label>

                <div className="register-page__input-wrapper">

                  <span className="register-page__input-icon">•</span>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="register-page__password-toggle"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

                <small>
                  Use at least 6 characters.
                </small>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="register-page__field">
                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <div className="register-page__input-wrapper">

                  <span className="register-page__input-icon">•</span>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="register-page__password-toggle"
                    onClick={() =>
                      setShowConfirmPassword((previous) => !previous)
                    }
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>

                </div>
              </div>

              {/* SKILLS */}
              <div className="register-page__field">

                <div className="register-page__skills-header">
                  <div>
                    <label>Your Skills</label>
                    <small>
                      Select up to 4 skills
                    </small>
                  </div>

                  <span>
                    {selectedSkills.length}/4
                  </span>
                </div>

                <div className="register-page__skills">

                {/* PREDEFINED SKILLS */}
                {skillOptions.map((skill) => {
                  const selected = selectedSkills.includes(skill);

                  return (
                    <button
                      key={skill}
                      type="button"
                      className={
                        selected
                          ? "register-page__skill active"
                          : "register-page__skill"
                      }
                      onClick={() => toggleSkill(skill)}
                    >
                      {selected && <span>✓</span>}
                      {skill}
                    </button>
                  );
                })}

  {/* CUSTOM SKILLS */}
  {selectedSkills
    .filter((skill) => !skillOptions.includes(skill))
    .map((skill) => (
      <button
        key={skill}
        type="button"
        className="register-page__skill active"
        onClick={() => toggleSkill(skill)}
      >
        <span>✓</span>
        {skill}
      </button>
    ))}

  {/* ADD SKILL */}
  {!showCustomSkillInput && selectedSkills.length < 4 && (
    <button
      type="button"
      className="register-page__skill register-page__skill--custom"
      onClick={() => setShowCustomSkillInput(true)}
    >
      <span>+</span>
      Add skill
    </button>
  )}

</div>

                {/* CUSTOM SKILL INPUT */}
                {showCustomSkillInput && (
                  <div className="register-page__custom-skill">

                    <input
                      type="text"
                      placeholder="Enter a skill, e.g. Flutter"
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
                      className="register-page__custom-skill-cancel"
                      onClick={() => {
                        setCustomSkill("");
                        setShowCustomSkillInput(false);
                      }}
                    >
                      Cancel
                    </button>

                  </div>
                )}

              </div>

              {/* TERMS */}
              <label className="register-page__terms-check">

                <input type="checkbox" required />

                <span>
                  I agree to Projectly's terms and privacy policy.
                </span>

              </label>

              {/* SUBMIT */}
              <button
                type="submit"
                className="register-page__submit"
              >
                Create Account
                <span>→</span>
              </button>

            </form>

            <div className="register-page__divider">
              <span>OR</span>
            </div>

            <div className="register-page__login">
              <span>Already have an account?</span>

              <Link to="/login">
                Sign in
              </Link>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}

export default Register;