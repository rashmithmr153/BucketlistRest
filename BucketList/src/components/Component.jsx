import { useState, useEffect } from "react";
import { getPlaces, togglePlace } from "../List/api.js";
function CheckedList({ place, toggleVisited }) {
  return (
    <li>
      <label onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={place.is_visited}
          onChange={() => toggleVisited(place.id)}
        />
        <span>{place.place_name}</span>
      </label>
    </li>
  );
}
function CategoryCard({
  title,
  items,
  icon,
  active,
  setActive,
  toggleVisited,
}) {
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

function ProgressBar({ progressPercent }) {
  return (
    <div className="progressContainer">
      <div
        className="progressBar"
        style={{ width: progressPercent + "%" }}
      ></div>
    </div>
  );
}

function Components() {
  const [activeCard, setActiveCard] = useState(null);
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    getPlaces().then((data) => {
      console.log("API DATA:", data);
      setPlaces(data);
    });
  }, []);
  const grouped = {
    cafes: places.filter((p) => p.category === "cafe"),
    breakfast: places.filter((p) => p.category === "breakfast"),
    finedine: places.filter((p) => p.category === "finedine"),
    seafood: places.filter((p) => p.category === "seafood"),
    icecream: places.filter((p) => p.category === "icecream"),
    other: places.filter((p) => p.category === "other"),
  };
  const total = places.length;
  const visitedCount = places.filter((p) => p.is_visited).length;
  const progressPercent = total === 0 ? 0 : (visitedCount / total) * 100;
  async function toggleVisited(id) {
    await togglePlace(id);

    setPlaces((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_visited: !p.is_visited } : p)),
    );
  }
  return (
    <>
      <div className="card progressCard">
        <h1 className="bucketTitle">Bucket List</h1>

        <div className="progressHeader">
          <h2>
            Visited {visitedCount} / {total}
          </h2>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <ProgressBar progressPercent={progressPercent} />
      </div>
      <div className="components">
        <CategoryCard
          title="Breakfast"
          items={grouped.breakfast}
          icon="bi-egg-fried"
          active={activeCard === "breakfast"}
          setActive={() =>
            setActiveCard(activeCard === "breakfast" ? null : "breakfast")
          }
          toggleVisited={toggleVisited}
        />

        <CategoryCard
          title="Cafes"
          items={grouped.cafes}
          icon="bi-cup-hot"
          active={activeCard === "cafes"}
          setActive={() =>
            setActiveCard(activeCard === "cafes" ? null : "cafes")
          }
          toggleVisited={toggleVisited}
        />

        <CategoryCard
          title="FineDine"
          items={grouped.finedine}
          icon="bi-star"
          active={activeCard === "finedine"}
          setActive={() =>
            setActiveCard(activeCard === "finedine" ? null : "finedine")
          }
          toggleVisited={toggleVisited}
        />

        <CategoryCard
          title="Seafood"
          items={grouped.seafood}
          icon="bi-water"
          active={activeCard === "seafood"}
          setActive={() =>
            setActiveCard(activeCard === "seafood" ? null : "seafood")
          }
          toggleVisited={toggleVisited}
        />

        <CategoryCard
          title="IceCream"
          items={grouped.icecream}
          icon="bi-snow"
          active={activeCard === "icecream"}
          setActive={() =>
            setActiveCard(activeCard === "icecream" ? null : "icecream")
          }
          toggleVisited={toggleVisited}
        />

        <CategoryCard
          title="Other"
          items={grouped.other}
          icon="bi-shop"
          active={activeCard === "other"}
          setActive={() =>
            setActiveCard(activeCard === "other" ? null : "other")
          }
          toggleVisited={toggleVisited}
        />
      </div>
    </>
  );
}
export default Components;
