import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import ParticlesBackground from "../../components/ParticlesBackground/ParticlesBackground";

import "./Landing.scss";

function Landing() {
  const landingRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      // Initial states
      gsap.set(
        [
          ".landing__navbar",
          ".landing__eyebrow",
          ".landing h1",
          ".landing__content > p",
          ".landing__actions",
          ".landing__trust",
        ],
        {
          opacity: 0,
          y: 30,
        }
      );

      gsap.set(".landing__visual-card", {
        opacity: 0,
        y: 35,
        scale: 0.94,
      });

      gsap.set(".landing__floating-card--top", {
        opacity: 0,
        x: 35,
        scale: 0.9,
      });

      gsap.set(".landing__floating-card--bottom", {
        opacity: 0,
        x: -35,
        scale: 0.9,
      });

      gsap.set(".landing__visual-glow", {
        opacity: 0,
        scale: 0.7,
      });

      // Navbar
      tl.to(".landing__navbar", {
        opacity: 1,
        y: 0,
        duration: 0.7,
      })

        // Hero text
        .to(
          ".landing__eyebrow",
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
          },
          "-=0.35"
        )

        .to(
          ".landing h1",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.25"
        )

        .to(
          ".landing__content > p",
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.45"
        )

        // CTA buttons
        .to(
          ".landing__actions",
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
          },
          "-=0.3"
        )

        // Trust section
        .to(
          ".landing__trust",
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
          },
          "-=0.3"
        )

        // Main visual
        .to(
          ".landing__visual-card",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "back.out(1.4)",
          },
          "-=0.75"
        )

        // Glow
        .to(
          ".landing__visual-glow",
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.8"
        )

        // Floating cards
        .to(
          ".landing__floating-card--top",
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.65,
            ease: "back.out(1.5)",
          },
          "-=0.65"
        )

        .to(
          ".landing__floating-card--bottom",
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.65,
            ease: "back.out(1.5)",
          },
          "-=0.5"
        );

      // Subtle floating animation for the main card
      gsap.to(".landing__visual-card", {
        y: -7,
        rotation: 1.2,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.2,
      });

      // Floating notification cards
      gsap.to(".landing__floating-card--top", {
        y: -8,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.5,
      });

      gsap.to(".landing__floating-card--bottom", {
        y: 7,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.8,
      });

      // Ambient glow breathing effect
      gsap.to(".landing__visual-glow", {
        scale: 1.12,
        opacity: 0.8,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, landingRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="landing" ref={landingRef}>
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