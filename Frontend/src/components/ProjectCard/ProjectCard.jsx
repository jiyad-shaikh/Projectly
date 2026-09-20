import { useNavigate } from "react-router-dom";

import "./ProjectCard.scss";

function ProjectCard({
  id,
  title,
  description,
  category,
  skills,
  members,
  teamSize,
  deadline
}) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/projects/${id}`);
  };


  return (
    <article
      className="project-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          handleCardClick();
        }
      }}
    >

      {/* Header */}

      <div className="project-card__header">

        <span className="project-card__category">
          {category}
        </span>

      </div>


      {/* Title */}

      <h3 className="project-card__title">
        {title}
      </h3>


      {/* Description */}

      <p className="project-card__description">
        {description}
      </p>


      {/* Skills */}

      <div className="project-card__skills">

        {skills.map((skill) => (
          <span key={skill}>
            {skill}
          </span>
        ))}

      </div>


      {/* Footer */}

      <div className="project-card__footer">

        <div className="project-card__members">

          <div className="project-card__avatars">

            {members.map((member, index) => (
              <div
                className="project-card__avatar"
                key={index}
              >
                {member}
              </div>
            ))}

          </div>

          <span>
            {members.length}/{teamSize} members
          </span>

        </div>


        <div className="project-card__action">

          <span className="project-card__deadline">
            Due {deadline}
          </span>

          <span className="project-card__view">
            View Project →
          </span>

        </div>

      </div>

    </article>
  );
}

export default ProjectCard;