
const BASE_URL = import.meta.env.VITE_BACKEND_URL;// your backend
console.log("BASE_URL:", BASE_URL);
export const getPlants = async () => {
  const res = await fetch(`${BASE_URL}/api/plant`);
  return res.json();
};

export const getPlantById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/plant/${id}`);
  return res.json();
};