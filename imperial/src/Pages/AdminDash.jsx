import { useEffect, useState } from "react";
import { Outlet } from 'react-router-dom'
const BASE_URL =  import.meta.env.VITE_BACKEND_URL

function AdminDashboard() {
    const [plants, setPlants] = useState([]);
    const [editingId, setEditingId] = useState(null);
    
  const [form, setForm] = useState({
    name: "",
    scientificName: "",
    category: "",
    price: "",
    description: "",
    image: null,
    careDetails: {
      watering: "",
      sunlight: "",
      temperature: "",
    },
  });

  // 🔄 Fetch all plants
  const fetchPlants = async () => {
    const res = await fetch(`${BASE_URL}/api/plant`);
    const data = await res.json();
    setPlants(data.data);
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  // 🧠 Handle inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["watering", "sunlight", "temperature"].includes(name)) {
      setForm({
        ...form,
        careDetails: {
          ...form.careDetails,
          [name]: value,
        },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };
  const [loading, setLoading] = useState(false);

  // 📁 Handle file
  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  // ➕ Create / ✏️ Update
  const handleSubmit = async (e) => {
    e.preventDefault();
  if (loading) return; //
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("scientificName", form.scientificName);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("description", form.description);

    // Optional careDetails
    if (form.careDetails.watering)
      formData.append("watering", form.careDetails.watering);
    if (form.careDetails.sunlight)
      formData.append("sunlight", form.careDetails.sunlight);
    if (form.careDetails.temperature)
      formData.append("temperature", form.careDetails.temperature);

    if (form.image) {
        formData.append("image", form.image);
    }
    
    resetForm();
    if (editingId) {
      await fetch(`${BASE_URL}/api/plant/${editingId}`, {
        method: "PUT",
        body: formData,
      });
    } else {
      await fetch(`${BASE_URL}/api/plant/create`, {
        method: "POST",
        body: formData,
      });
    }

    fetchPlants();
  };

  // ✏️ Edit
  const handleEdit = (plant) => {
    setEditingId(plant._id);

    setForm({
      name: plant.name || "",
      scientificName: plant.scientificName || "",
      category: plant.category || "",
      price: plant.price || "",
      description: plant.description || "",
      image: null,
      careDetails: {
        watering: plant.careDetails?.watering || "",
        sunlight: plant.careDetails?.sunlight || "",
        temperature: plant.careDetails?.temperature || "",
      },
    });
  };

  // ❌ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plant?")) return;

    await fetch(`${BASE_URL}/api/plant/${id}`, {
  method: 'DELETE',
  headers: {
    token: localStorage.getItem('token'),  // ✅ add this
  },
});

    fetchPlants();
  };

  // 🔄 Reset form
  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      scientificName: "",
      category: "",
      price: "",
      description: "",
      image: null,
      careDetails: {
        watering: "",
        sunlight: "",
        temperature: "",
      },
    });
  };
  const handleRegenerateQR = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/api/plant/${id}/qr`);
    const data = await res.json();

    if (data.success) {
      // Update UI without full reload
      setPlants((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, qrCodeUrl: data.qrCodeUrl } : p
        )
      );
    }
  } catch (err) {
    console.error("QR generation failed", err);
  }
};

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>🌿 Admin Dashboard</h1>

//       {/* FORM */}
//       <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
//         <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
//         <input name="scientificName" placeholder="Scientific Name" value={form.scientificName} onChange={handleChange} />
//         <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
//         <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
//         <input name="image" type="file" onChange={handleFileChange} />

//         <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />

//         <h4>Care Details (Optional)</h4>
//         <input name="watering" placeholder="Watering" value={form.careDetails.watering} onChange={handleChange} />
//         <input name="sunlight" placeholder="Sunlight" value={form.careDetails.sunlight} onChange={handleChange} />
//         <input name="temperature" placeholder="Temperature" value={form.careDetails.temperature} onChange={handleChange} />

//       <button type="submit" disabled={loading}>
//   {loading ? "Saving..." : editingId ? "Update Plant" : "Add Plant"}
// </button>

//         {editingId && (
//           <button type="button" onClick={resetForm}>
//             Cancel
//           </button>
//         )}
//       </form>

//       {/* TABLE */}
//       <table border="1" cellPadding="10">
//         <thead>
//           <tr>
//             <th>Image</th>
//             <th>Name</th>
//             <th>Category</th>
//             <th>Price</th>
//             <th>QR</th>
//             <th>Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {plants.map((plant) => (
//             <tr key={plant._id}>
//               <td>
//                 {plant.imageUrl && (
//                   <img
//                     src={`${plant.imageUrl}`}
//                     alt={plant.name}
//                     width="60"
//                   />
//                 )}
//               </td>

//               <td>{plant.name}</td>
//               <td>{plant.category}</td>
//               <td>₹{plant.price}</td>

//               <td>
//                 {plant.qrCodeUrl && (
//                   <img src={plant.qrCodeUrl} width="60" />
//                 )}
//               </td>

//               <td>
//                 <button onClick={() => handleEdit(plant)}>Edit</button>
//                 <button onClick={() => handleDelete(plant._id)}>Delete</button>
//               </td>
//               <td>


//   <button onClick={() => handleRegenerateQR(plant._id)}>
//     Regenerate QR
//   </button>
// </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );



return(
<>
 <div >
    
    <Outlet/>
    </div>
</>
)}


export default AdminDashboard;