
export const getPlaces= async ()=>{
    const res= await fetch("https://bucketlistrest.onrender.com/places")
    return res.json()
}
export async function togglePlace(id) {
  await fetch(`https://bucketlistrest.onrender.com/places/${id}`, {
    method: "PATCH",
  });
}