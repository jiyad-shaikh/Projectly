import { Link } from "react-router-dom";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import "./Landing.scss";
import ParticlesBackground from "../../components/ParticlesBackground/ParticlesBackground";

function Landing() {
  return (
    <main className="landing">
      <ParticlesBackground />
      <nav className="landing__navbar">
        <Link to="/" className="landing__brand">
          <div className="landing__brand-mark">P</div>
          <span>Projectly</span>
        </Link>

        <div className="landing__nav-actions">
          <ThemeToggle />

          <Link to="/login" className="landing__login">
            Login
          </Link>

          <Link to="/register" className="landing__signup">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="landing__hero">
        <div className="landing__content">
          <span className="landing__eyebrow">
            COLLEGE PROJECT PARTNER FINDER
          </span>

          <h1>
            Find the right people
            <span> for your next project.</span>
          </h1>

          <p>
            Discover students with the skills you need, build your project
            team, and turn your college ideas into something real.
          </p>

          <div className="landing__actions">
            <Link to="/register" className="landing__primary-btn">
              Find Project Partners
              <span>→</span>
            </Link>

            <Link to="/projects" className="landing__secondary-btn">
              Explore Projects
            </Link>
          </div>

          <div className="landing__trust">
            <div className="landing__trust-avatars">
              <span>J</span>
              <span>A</span>
              <span>R</span>
              <span>+</span>
            </div>

            <div>
              <strong>Build together.</strong>
              <p>Find students who complement your skills.</p>
            </div>
          </div>
        </div>

        <div className="landing__visual">
          <div className="landing__visual-glow"></div>

          <div className="landing__visual-card">
            <div className="landing__visual-header">
              <div>
                <span>PROJECT</span>
                <h3>Smart Expense Tracker</h3>
              </div>

              <span className="landing__status">Open</span>
            </div>

            <div className="landing__skills">
              <span>React</span>
              <span>Node.js</span>
              <span>MongoDB</span>
              <span>UI/UX</span>
            </div>

            <div className="landing__team">
              <div className="landing__avatars">
                <span>J</span>
                <span>A</span>
                <span>R</span>
              </div>

              <div className="landing__team-info">
                <strong>3 / 4</strong>
                <p>team members</p>
              </div>
            </div>

            <div className="landing__project-footer">
              <span>Looking for</span>
              <strong>1 more teammate</strong>
            </div>
          </div>

          <div className="landing__floating-card landing__floating-card--top">
            <span>✓</span>
            <div>
              <strong>Perfect skill match</strong>
              <small>React · Node.js</small>
            </div>
          </div>

          <div className="landing__floating-card landing__floating-card--bottom">
            <span>4</span>
            <div>
              <strong>Team members</strong>
              <small>Ready to collaborate</small>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Landing;