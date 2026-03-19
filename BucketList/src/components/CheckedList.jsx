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

export default CheckedList;