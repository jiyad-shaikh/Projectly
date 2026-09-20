import "./StatCard.scss";

function StatCard({ label, value, description, icon }) {
  return (
    <div className="stat-card">

      <div className="stat-card__top">
        <div className="stat-card__icon">
          {icon}
        </div>
      </div>

      <div className="stat-card__value">
        {value}
      </div>

      <div className="stat-card__label">
        {label}
      </div>

      <div className="stat-card__description">
        {description}
      </div>

    </div>
  );
}

export default StatCard;