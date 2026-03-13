import {
  cafes,
  otherRestaurants,
  breakfastPoints,
  fineDine,
  iceCreamDessert,
  seafood
} from "../List/data.js";
import { useState,useEffect } from "react";
function CheckedList({ name, idx, visited, toggleVisited }) {
  return (
    <li>
      <label onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={!!visited[idx]}
          
          onChange={() => toggleVisited(idx)}
        />
        <span>{name}</span>
      </label>
    </li>
  );
}
function CategoryCard({title, items, prefix,icon, active, setActive, visited, toggleVisited}) {
    const totalItems = items.length

    const visitedCount = items.filter((_, idx) =>
    visited[prefix + "-" + idx]
    ).length

    const percent = (visitedCount / totalItems) * 100
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
            <div
            className="miniProgressBar"
            style={{ width: percent + "%" }}
            />
            </div>
        </div>

      <ul>
        {active && items.map((item, idx) => {
          const id = prefix + "-" + idx

          return (
            <CheckedList
              key={idx}
              name={item}
              idx={id}
              visited={visited}
              toggleVisited={toggleVisited}
            />
          )
        })}
      </ul>
    </div>
  )
}









function ProgressBar({progressPercent}){
    return(
    <div className="progressContainer">
        <div className="progressBar" style={{ width: progressPercent + "%" }}></div>
    </div>)
}

function Components(){
    const [activeCard,setActiveCard] = useState(null);
    const [visited, setVisited] = useState(() => {
  const saved = localStorage.getItem("visitedPlaces")
  return saved ? JSON.parse(saved) : {}
})
    const total=
    cafes.length+fineDine.length+otherRestaurants.length+breakfastPoints.length+iceCreamDessert.length+seafood.length
    const visitedCount = Object.keys(visited).length;
    const progressPercent=(visitedCount/total)*100
    function toggleVisited(id){
        // console.log(visited)
        setVisited((prev) => {
            const updated={...prev}

            if (updated[id]){
                delete updated[id]
            }
            else{
                updated[id]=true
            }
            return updated
        })
    }
    useEffect(() => {
  localStorage.setItem("visitedPlaces", JSON.stringify(visited))
}, [visited])
    return(
        <>
        <div className="card progressCard">
            <h1 className="bucketTitle">Bucket List</h1>

        <div className="progressHeader">
                <h2>Visited {visitedCount} / {total}</h2>
                <span>{Math.round(progressPercent)}%</span>
        </div>
            <ProgressBar progressPercent={progressPercent}/>
            </div>
            <div className="components">

  <CategoryCard
  title="Breakfast"
  items={breakfastPoints}
  prefix="breakfast"
  icon="bi-egg-fried"
  active={activeCard==="breakfast"}
  setActive={()=>setActiveCard(activeCard==="breakfast"?null:"breakfast")}
  visited={visited}
  toggleVisited={toggleVisited}
/>

<CategoryCard
  title="Cafes"
  items={cafes}
  prefix="cafes"
  icon="bi-cup-hot"
  active={activeCard==="cafes"}
  setActive={()=>setActiveCard(activeCard==="cafes"?null:"cafes")}
  visited={visited}
  toggleVisited={toggleVisited}
/>

<CategoryCard
  title="FineDine"
  items={fineDine}
  prefix="finedine"
  icon="bi-star"
  active={activeCard==="finedine"}
  setActive={()=>setActiveCard(activeCard==="finedine"?null:"finedine")}
  visited={visited}
  toggleVisited={toggleVisited}
/>

<CategoryCard
  title="Seafood"
  items={seafood}
  prefix="seafood"
  icon="bi-water"
  active={activeCard==="seafood"}
  setActive={()=>setActiveCard(activeCard==="seafood"?null:"seafood")}
  visited={visited}
  toggleVisited={toggleVisited}
/>

<CategoryCard
  title="IceCream"
  items={iceCreamDessert}
  prefix="icecream"
  icon="bi-snow"
  active={activeCard==="icecream"}
  setActive={()=>setActiveCard(activeCard==="icecream"?null:"icecream")}
  visited={visited}
  toggleVisited={toggleVisited}
/>

<CategoryCard
  title="Other"
  items={otherRestaurants}
  prefix="other"
  icon="bi-shop"
  active={activeCard==="other"}
  setActive={()=>setActiveCard(activeCard==="other"?null:"other")}
  visited={visited}
  toggleVisited={toggleVisited}
/>
</div>
        </>
        )
}
export default Components