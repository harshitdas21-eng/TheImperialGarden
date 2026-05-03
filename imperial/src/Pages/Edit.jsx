import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { Navigate } from 'react-router-dom';
import { uploadToCloudinary } from '../Helper/UploadCloudinary';
const BASE_URL =  import.meta.env.VITE_BACKEND_URL
const emptyVariant = { size: '', price: '', image: null, imageUrl: '' };

const Edit = () => {
    
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasVariants, setHasVariants] = useState(false);
  const [qrPreview, setQrPreview] = useState('');

  const [form, setForm] = useState({
    name: '',
    scientificName: '',
    category: [],
    price: '',
      size: '', 
    description: '',
    image: null,
    imageUrl: '',   // existing cloudinary url
    variants: [],
    careDetails: { watering: '', sunlight: '', temperature: '' },
  });

  // ✅ Fetch existing plant
  useEffect(() => {
    const fetchPlant = async () => {
      const res = await fetch(`${BASE_URL}/api/plant/${id}`);
      const data = await res.json();
      const plant = data.data;

      setForm({
        name: plant.name || '',
        scientificName: plant.scientificName || '',
        category: Array.isArray(plant.category) ? plant.category : [],
        price: plant.price || '',
        size: plant.size || '', 
        description: plant.description || '',
        image: null,
        imageUrl: plant.imageUrl || '',
        variants: plant.variants?.map(v => ({
          size: v.size || '',
          price: v.price || '',
          image: null,              // new file if replacing
          imageUrl: v.imageUrl || '', // existing url
          _id: v._id || null,
        })) || [],
        careDetails: {
          watering: plant.careDetails?.watering || '',
          sunlight: plant.careDetails?.sunlight || '',
          temperature: plant.careDetails?.temperature || '',
        },
      });

      // Show variants section if plant has variants
      if (plant.variants?.length > 0) setHasVariants(true);

      // Set QR preview
      if (plant.qrCodeUrl) setQrPreview(plant.qrCodeUrl);
    };
    fetchPlant();
  }, [id]);

  // Handlers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCareChange = (e) => {
    setForm({ ...form, careDetails: { ...form.careDetails, [e.target.name]: e.target.value } });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const addVariant = () => {
    setForm({ ...form, variants: [...form.variants, { ...emptyVariant }] });
  };

  const handleVariantChange = (index, field, value) => {
    const updated = form.variants.map((v, i) =>
      i === index ? { ...v, [field]: value } : v
    );
    setForm({ ...form, variants: updated });
  };

  const handleVariantFileChange = (index, file) => {
    const updated = form.variants.map((v, i) =>
      i === index ? { ...v, image: file } : v
    );
    setForm({ ...form, variants: updated });
  };

  const removeVariant = (index) => {
    setForm({ ...form, variants: form.variants.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (loading) return;
  setLoading(true);

  try {
    // ✅ Use existing URL or upload new image
    let imageUrl = form.imageUrl || '';
    if (form.image) {
      imageUrl = await uploadToCloudinary(form.image);
    }

    // ✅ Upload variant images
    const variantsWithUrls = await Promise.all(
      form.variants.map(async (v) => {
        let variantImageUrl = v.imageUrl || '';
        if (v.image) variantImageUrl = await uploadToCloudinary(v.image);
        return { size: v.size, price: v.price, imageUrl: variantImageUrl, _id: v._id };
      })
    );

    // ✅ Send JSON not FormData
    const payload = {
      name: form.name,
      scientificName: form.scientificName,
      category: form.category,
      description: form.description,
      careDetails: form.careDetails,
      imageUrl,
      ...(hasVariants
        ? { variants: variantsWithUrls }
        : { price: form.price, size: form.size, variants: [] }
      ),
    };

    const res = await fetch(`${BASE_URL}/api/plant/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('token'),
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log(data);
      alert('Update failed: ' + data.message);
      setLoading(false);
      return;
    }

    alert('Plant Updated!');
    navigate('/admin');

  } catch (err) {
    console.log('Error:', err);
    alert('Something went wrong: ' + err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#162D24] to-[#1B4732] px-12 py-16">
      <div className="max-w-3xl mx-auto">

        <h1 className="dancing-script-true text-[#d1c4a1] text-5xl mb-10">
          Edit Plant
        </h1>

        <form onSubmit={handleSubmit}>

          {/* Basic Info */}
          <section className="mb-8">
            <p className="text-[#d1c4a1]/50 text-xs tracking-widest uppercase mb-4">Basic Info</p>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Plant Name *" name="name" value={form.name} onChange={handleChange} />
              <Input label="Scientific Name" name="scientificName" value={form.scientificName} onChange={handleChange} />
            </div>

            {/* Image upload + existing preview */}
            <div className="mt-4">
              <label className="text-[#d1c4a1]/60 text-xs tracking-widest uppercase block mb-2">Plant Image</label>
              <div className="flex gap-6 items-center">
                <label className="cursor-pointer border border-dashed border-[#d1c4a1]/30 hover:border-[#d1c4a1]/60 text-[#d1c4a1]/50 hover:text-[#d1c4a1] text-xs tracking-widest uppercase px-6 py-4 transition-all text-center">
                  {form.image ? 'Change Image' : 'Replace Image'}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>

                {/* Show new preview OR existing cloudinary image */}
                {form.image ? (
                  <div className="relative">
                    <img src={URL.createObjectURL(form.image)} className="w-24 h-24 object-cover border border-[#d1c4a1]/20" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: null })}
                      className="absolute -top-2 -right-2 bg-red-500/80 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center"
                    >✕</button>
                  </div>
                ) : form.imageUrl ? (
                  <img src={form.imageUrl} className="w-24 h-24 object-cover border border-[#d1c4a1]/20" />
                ) : (
                  <div className="w-24 h-24 border border-dashed border-[#d1c4a1]/10 flex items-center justify-center text-[#d1c4a1]/20 text-xs">
                    No image
                  </div>
                )}
              </div>
            </div>

            {/* QR Preview */}
            {qrPreview && (
              <div className="mt-4">
                <p className="text-[#d1c4a1]/60 text-xs tracking-widest uppercase mb-2">QR Code</p>
                <img src={qrPreview} className="w-24 h-24 border border-[#d1c4a1]/20" />
              </div>
            )}

            {/* Category */}
                  <div className="mt-4">
  <label className="text-[#d1c4a1]/60 text-xs tracking-widest uppercase block mb-2">
    Category
  </label>

  <div className="grid grid-cols-2 gap-2">
    {[
      "Indoor",
      "Outdoor",
      "Vastu",
      "Semi-Indoor",
      "Aquatic",
      "Desert",
      "Hanging",
      "Medicinal",
      "Food"
    ].map((cat) => (
      <label
        key={cat}
        onClick={() => {
          setForm((prev) => {
            const exists = prev.category.includes(cat);

            return {
              ...prev,
              category: exists
                ? prev.category.filter((c) => c !== cat)
                : [...prev.category, cat],
            };
          });
        }}
        className="flex items-center gap-2 cursor-pointer"
      >
        <div
          className={`w-4 h-4 border rounded-sm flex items-center justify-center
          ${
            form.category.includes(cat)
              ? "bg-[#d1c4a1] border-[#d1c4a1]"
              : "border-[#d1c4a1]/40"
          }`}
        >
          {form.category.includes(cat) && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="#162D24"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>

        <span className="text-xs text-[#d1c4a1]/70 uppercase">
          {cat}
        </span>
      </label>
    ))}
  </div>
</div>

            {/* Description */}
            <div className="mt-4">
              <label className="text-[#d1c4a1]/60 text-xs tracking-widest uppercase block mb-2">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full bg-[#1a3d2b] border border-[#d1c4a1]/30 text-[#d1c4a1] px-4 py-3 text-sm focus:outline-none focus:border-[#d1c4a1] resize-none rounded-sm"
              />
            </div>
          </section>

          <div className="w-full h-px bg-[#d1c4a1]/20 mb-8" />

          {/* Care Details */}
        <section className="mb-8">
          <p className="text-[#d1c4a1]/50 text-xs tracking-widest uppercase mb-4">Care Details</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="mt-4">
          
            <select
              name="watering"
              value={form.careDetails.watering}
              onChange={handleCareChange}
              className="w-full bg-[#1a3d2b] border border-[#d1c4a1]/30 text-[#d1c4a1] px-4 py-3 text-sm focus:outline-none focus:border-[#d1c4a1] rounded-sm"
            >

            <option value="" className="bg-[#1a3d2b]">Watering</option>
            <option value="Daily" className="bg-[#1a3d2b]">Daily</option>

<option value="Every 2 days" className="bg-[#1a3d2b]">Every 2 days</option>

<option value="Every 3 days" className="bg-[#1a3d2b]">Every 3 days</option>

<option value="Twice a week" className="bg-[#1a3d2b]">Twice a week</option>

<option value="Every 3-4 days" className="bg-[#1a3d2b]">Every 3–4 days</option>

<option value="Weekly" className="bg-[#1a3d2b]">Weekly</option>

<option value="Every 10 days" className="bg-[#1a3d2b]">Every 10 days</option>

<option value="Bi-weekly" className="bg-[#1a3d2b]">Bi-weekly</option>

<option value="Monthly" className="bg-[#1a3d2b]">Monthly</option>

<option value="When soil is dry" className="bg-[#1a3d2b]">When soil is dry</option>
            </select>
          </div>
           <div className="mt-4">
          
            <select
              name="sunlight"
              value={form.careDetails.sunlight}
              onChange={handleCareChange}
              className="w-full bg-[#1a3d2b] border border-[#d1c4a1]/30 text-[#d1c4a1] px-4 py-3 text-sm focus:outline-none focus:border-[#d1c4a1] rounded-sm"
            >

            <option value="" className="bg-[#1a3d2b]">Sunlight</option>
           
<option value="Low Light">Low Light / Dim</option>
<option value="Indirect Light">Indirect Light</option>
<option value="Partial Sunlight">Partial Sunlight</option>
<option value="Full Sunlight">Full Sunlight (Daily)</option>
<option value="Direct Sunlight">Direct Sunlight (Always)</option>
<option value="No Sunlight">No Sunlight</option>
            </select>
          </div>
           
            <Input label="Temperature" required={true} name="temperature" value={form.careDetails.temperature} onChange={handleCareChange} />
          </div>
          <Input label="Size" name="size" value={form.size} onChange={handleChange} />
        </section>
          <div className="w-full h-px bg-[#d1c4a1]/20 mb-8" />

          {/* Variants */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#d1c4a1]/50 text-xs tracking-widest uppercase">Variants (sizes)</p>
              <div className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setHasVariants(!hasVariants);
                  if (!hasVariants && form.variants.length === 0) addVariant();
                  if (hasVariants) setForm({ ...form, variants: [] });
                }}
              >
                <div className={`w-10 h-5 rounded-full transition-all duration-300 relative ${hasVariants ? 'bg-[#d1c4a1]' : 'bg-[#d1c4a1]/20'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-[#162D24] transition-all duration-300 ${hasVariants ? 'left-5' : 'left-0.5'}`} />
                </div>
                <span className="text-[#d1c4a1]/60 text-xs tracking-widest uppercase">
                  {hasVariants ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            {hasVariants && (
              <div className="space-y-4">
                {form.variants.map((variant, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end border border-[#d1c4a1]/10 p-4">
                    <Input
                      label={`Size ${index + 1}`}
                      value={variant.size}
                      onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                      placeholder="3ft, 6ft..."
                    />
                    <Input
                      label="Price"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                      placeholder="299"
                    />

                    {/* Variant image */}
                    <div>
                      <label className="text-[#d1c4a1]/60 text-xs tracking-widest uppercase block mb-2">Image</label>
                      <div className="flex gap-3 items-center min-w-0">
                        <label className="cursor-pointer border border-dashed border-[#d1c4a1]/30 hover:border-[#d1c4a1]/60 text-[#d1c4a1]/40 text-xs px-3 py-2 transition-all">
                          {variant.image ? 'Change' : variant.imageUrl ? 'Replace' : '+ Upload'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleVariantFileChange(index, e.target.files[0])}
                            className="hidden"
                          />
                        </label>

                        {/* New file preview OR existing url */}
                        {variant.image ? (
                          <img src={URL.createObjectURL(variant.image)} className="w-10 h-10 object-cover shrink-0 border border-[#d1c4a1]/20" />
                        ) : variant.imageUrl ? (
                          <img src={variant.imageUrl} className="w-10 h-10 object-cover shrink-0 border border-[#d1c4a1]/20" />
                        ) : (
                          <div className="w-10 h-10 border border-dashed border-[#d1c4a1]/10 flex items-center justify-center text-[#d1c4a1]/20 text-xs">—</div>
                        )}

                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-[#d1c4a1]/40 hover:text-red-400 transition-colors text-lg ml-auto"
                        >✕</button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add new variant */}
                <button
                  type="button"
                  onClick={addVariant}
                  className="border border-dashed border-[#d1c4a1]/30 text-[#d1c4a1]/50 hover:text-[#d1c4a1] hover:border-[#d1c4a1]/60 text-xs tracking-widest uppercase px-6 py-3 w-full transition-all"
                >
                  + Add Size
                </button>
              </div>
            )}

            {!hasVariants && (
              <Input label="Price" name="price" value={form.price} onChange={handleChange} placeholder="299" />
            )}
          </section>

          <div className="w-full h-px bg-[#d1c4a1]/20 mb-8" />

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#d1c4a1] text-[#162D24] py-4 text-sm tracking-widest uppercase font-medium hover:bg-[#c4b48e] transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Update Plant'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 border border-[#d1c4a1]/30 text-[#d1c4a1]/60 hover:text-[#d1c4a1] hover:border-[#d1c4a1]/60 text-sm tracking-widest uppercase transition-all"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

function Input({ label, name, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[#d1c4a1]/60 text-xs tracking-widest uppercase">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        className="bg-[#1a3d2b] border border-[#d1c4a1]/30 text-[#d1c4a1] placeholder:text-[#d1c4a1]/20 px-4 py-3 text-sm tracking-wide focus:outline-none focus:border-[#d1c4a1] rounded-sm w-full"
      />
    </div>
  );
}

export default Edit;
