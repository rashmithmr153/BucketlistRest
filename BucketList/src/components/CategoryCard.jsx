import CheckedList from "./CheckedList";

function CategoryCard({ title, items, icon, active, setActive, toggleVisited }) {
  const totalItems = items.length;
  const visitedCount = items.filter((p) => p.is_visited).length;
  const percent = totalItems === 0 ? 0 : (visitedCount / totalItems) * 100;

  return (
    <div className={`card ${active ? "activeCard" : ""}`} onClick={setActive}>
      <div className="cardHeader">
        <h2>
          <i className={`bi ${icon}`}></i> {title}
        </h2>
        <span className="cardCount">
          {visitedCount}/{totalItems}
        </span>

        <div className="miniProgress">
          <div className="miniProgressBar" style={{ width: percent + "%" }} />
        </div>
      </div>

      <ul>
        {active &&
          items.map((place) => (
            <CheckedList
              key={place.id}
              place={place}
              toggleVisited={toggleVisited}
            />
          ))}
      </ul>
    </div>
  );
}

export default CategoryCard;