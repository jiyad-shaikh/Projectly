import { useState, useEffect } from "react";
import { getProjects } from "../../services/project.api";
import PageShell from "../../components/PageShell/PageShell";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import "./Projects.scss";

const categories = [
  "All",
  "Web Development",
  "Full Stack",
  "AI / ML",
  "Mobile App",
  "UI/UX"
];

function Projects() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD PROJECTS FROM BACKEND
  // ==========================================

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProjects();

        setProjects(data.projects || []);
      } catch (error) {
        console.error("Failed to load projects:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load projects."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // ==========================================
  // SEARCH + CATEGORY FILTER
  // ==========================================

  const filteredProjects = projects.filter((project) => {
    const searchTerm = search.toLowerCase().trim();

    const matchesSearch =
      project.title?.toLowerCase().includes(searchTerm) ||
      project.description?.toLowerCase().includes(searchTerm) ||
      project.requiredSkills?.some((skill) =>
        skill.toLowerCase().includes(searchTerm)
      );

    const matchesCategory =
      activeCategory === "All" ||
      project.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All");
  };

  return (
    <PageShell
      sidebarOpen={sidebarOpen}
      onSidebarOpen={() => setSidebarOpen(true)}
      onSidebarClose={() => setSidebarOpen(false)}
    >
      <div className="projects">

        {/* ========================================
            HEADER
        ======================================== */}

        <header className="projects__header">

          <div>
            <p className="projects__eyebrow">
              PROJECT DISCOVERY
            </p>

            <h1>
              Find your next project
            </h1>

            <p className="projects__subtitle">
              Explore projects looking for students like you.
            </p>
          </div>

          <div className="projects__count">
            <strong>
              {loading ? "—" : filteredProjects.length}
            </strong>

            <span>
              {filteredProjects.length === 1
                ? "project found"
                : "projects found"}
            </span>
          </div>

        </header>


        {/* ========================================
            SEARCH + FILTERS
        ======================================== */}

        <section className="projects__toolbar">

          <div className="projects__search">

            <span className="projects__search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search projects, skills, or keywords..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            {search && (
              <button
                className="projects__search-clear"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}

          </div>


          <div className="projects__filters">

            {categories.map((category) => (
              <button
                key={category}
                className={
                  activeCategory === category
                    ? "projects__filter active"
                    : "projects__filter"
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}

          </div>

        </section>


        {/* ========================================
            LOADING STATE
        ======================================== */}

        {loading && (

          <section className="projects__empty">

            <div className="projects__loading-spinner"></div>

            <h2>
              Loading projects...
            </h2>

            <p>
              We're finding projects for you.
            </p>

          </section>

        )}


        {/* ========================================
            ERROR STATE
        ======================================== */}

        {!loading && error && (

          <section className="projects__empty">

            <div className="projects__empty-icon">
              !
            </div>

            <h2>
              Something went wrong
            </h2>

            <p>
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>

          </section>

        )}


        {/* ========================================
            PROJECTS GRID
        ======================================== */}

        {!loading && !error && filteredProjects.length > 0 && (

          <section className="projects__grid">

            {filteredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                id={project._id}
                title={project.title}
                description={project.description}
                category={project.category}
                skills={project.requiredSkills || []}
                members={[]}
                teamSize={project.teamSize}
                deadline={project.deadline}
              />
            ))}

          </section>

        )}


        {/* ========================================
            NO RESULTS
        ======================================== */}

        {!loading &&
          !error &&
          filteredProjects.length === 0 && (

            <section className="projects__empty">

              <div className="projects__empty-icon">
                ⌕
              </div>

              <h2>
                No projects found
              </h2>

              <p>
                Try changing your search or selecting
                another category.
              </p>

              <button onClick={clearFilters}>
                Clear filters
              </button>

            </section>

          )}

      </div>
    </PageShell>
  );
}

export default Projects;