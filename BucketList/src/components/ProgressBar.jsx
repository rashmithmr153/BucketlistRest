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
export function Addform(){
    return(
        <div className="addForm">
    <form>
      <input type="text" placeholder="Name" /><br/>
      <select>
        <option value="cafe">Cafe</option>
        <option value="breakfast">Breakfast</option>
        <option value="finedine">FineDine</option>
        <option value="seafood">Seafood</option>
        <option value="icecream">Ice Cream</option>
        <option value="other">Other</option>
      </select><br/>
      <button type="submit">Add</button>
    </form>
  </div>
    )
}
