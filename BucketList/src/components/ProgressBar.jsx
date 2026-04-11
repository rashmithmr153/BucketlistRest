export function ProgressBar({ progressPercent }) {
  return (
    <div className="progressContainer">
      <div
        className="progressBar"
        style={{ width: progressPercent + "%" }}
      ></div>
    </div>
  );
}
import { useState } from "react";
import { addPlace } from "../List/api";

export function Addform({ onPlaceAdded }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("cafe");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPlace = { place_name: name, category };
    await addPlace(newPlace);
    setName("");
    if (onPlaceAdded) onPlaceAdded();
  };

  return (
    <div className="addForm">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="cafe">Cafe</option>
          <option value="breakfast">Breakfast</option>
          <option value="finedine">FineDine</option>
          <option value="seafood">Seafood</option>
          <option value="icecream">Ice Cream</option>
          <option value="other">Other</option>
        </select>
        <br />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
