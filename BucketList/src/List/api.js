
export const getPlaces= async ()=>{
    const res= await fetch("http://localhost:8080/places")
    return res.json()
}
export async function togglePlace(id) {
  await fetch(`http://localhost:8080/places/${id}`, {
    method: "PATCH",
  });
}