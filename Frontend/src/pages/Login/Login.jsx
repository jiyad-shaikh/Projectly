import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import "./Login.scss";
import { useAuth } from "../../hooks/useAuth";
import ParticlesBackground from "../../components/ParticlesBackground/ParticlesBackground";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = event => {
    const { name, value } = event.target;

    setFormData(previous => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    await login({
      email: formData.email,
      password: formData.password
    });

    navigate("/dashboard");
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Unable to sign in. Please check your credentials.";

    alert(message);
  }
};

  return (
    <div className="login-page">

      <ParticlesBackground />

      {/* Decorative Background */}
      <div className="login-page__glow login-page__glow--one"></div>
      <div className="login-page__glow login-page__glow--two"></div>

      <div className="login-page__layout">

        {/* Left Side */}
        <section className="login-page__visual">

          <Link to="/" className="login-page__brand">
            <div className="login-page__brand-mark">
              P
            </div>

            <div>
              <strong>Projectly</strong>
              <span>Partner Finder</span>
            </div>
          </Link>

          <div className="login-page__visual-content">

            <div className="login-page__eyebrow">
              BUILD TOGETHER
            </div>

            <h1>
              Great projects
              <span>start with great teams.</span>
            </h1>

            <p>
              Find students who complement your skills, discover
              exciting projects, and build something meaningful
              together.
            </p>

            <div className="login-page__mini-card">

              <div className="login-page__mini-icon">
                ✦
              </div>

              <div>
                <strong>Find your project people.</strong>
                <span>
                  Skills. Ideas. Collaboration.
                </span>
              </div>

            </div>

          </div>

          <div className="login-page__visual-footer">
            <span>© 2026 Projectly</span>
            <span>Made for college teams</span>
          </div>

        </section>

        {/* Right Side */}
        <section className="login-page__form-section">
          
          <div className="login-page__theme-toggle">
            <ThemeToggle />
          </div>

          <div className="login-page__mobile-brand">
            <Link to="/" className="login-page__brand">
              <div className="login-page__brand-mark">
                P
              </div>

              <strong>Projectly</strong>
            </Link>
          </div>

          <div className="login-page__form-wrapper">

            <div className="login-page__form-header">
              <p>WELCOME BACK</p>

              <h2>Sign in to Projectly</h2>

              <span>
                Continue finding teammates and building projects.
              </span>
            </div>

            <form
              className="login-page__form"
              onSubmit={handleSubmit}
            >

              {/* Email */}
              <div className="login-page__field">

                <label htmlFor="email">
                  Email Address
                </label>

                <div className="login-page__input-wrapper">

                  <span className="login-page__input-icon">
                    @
                  </span>

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

              {/* Password */}
              <div className="login-page__field">

                <div className="login-page__label-row">

                  <label htmlFor="password">
                    Password
                  </label>

                  <button
                    type="button"
                    className="login-page__forgot"
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="login-page__input-wrapper">

                  <span className="login-page__input-icon">
                    •
                  </span>

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="login-page__password-toggle"
                    onClick={() =>
                      setShowPassword(previous => !previous)
                    }
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

              </div>

              {/* Remember */}
              <label className="login-page__remember">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={event =>
                    setRememberMe(event.target.checked)
                  }
                />

                <span>
                  Remember me
                </span>

              </label>

              {/* Submit */}
              <button
                type="submit"
                className="login-page__submit"
              >
                Sign In
                <span>→</span>
              </button>

            </form>

            <div className="login-page__divider">
              <span>OR</span>
            </div>

            <div className="login-page__signup">
              <span>Don't have an account?</span>

              <Link to="/register">
                Create an account
              </Link>
            </div>

            <p className="login-page__terms">
              By continuing, you agree to Projectly's terms
              and privacy policy.
            </p>

          </div>

        </section>

      </div>
    </div>
  );
}

export default Login;