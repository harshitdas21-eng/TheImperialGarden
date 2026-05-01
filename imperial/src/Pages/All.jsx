import { useEffect, useState } from "react";
import { getPlants } from "../Helper/api.js";
import { Droplet } from 'lucide-react';
import { Link } from "react-router-dom";
import { Sun } from 'lucide-react';
import Footer from "../Components/Footer.jsx";
import {useGSAP} from "@gsap/react"
import Animation from "./Gsap.jsx";
import gsap from "gsap"
function PlantCatalog() {
    const [plants, setPlants] = useState([]);
    const [categoryfilter,setcategoryfilter] = useState([])
      const [price,setPrice] = useState('PRICE')
  const[search,setsearch] = useState('')
  const [isOpen, setIsOpen] = useState(false);
const [isSpeciesOpen, setIsSpeciesOpen] = useState(false);
const [isPriceOpen, setIspriceOpen] = useState(false);
const [isTransmissionOpen, setIsTransmissionOpen] = useState(false);
const [isFuelOpen, setIsFuelOpen] = useState(false);
const priceOptions = ['LOW TO HIGH', 'HIGH TO LOW'];
const [category, setCategory] = useState("ALL SPECIES");
     useGSAP(()=>{
        const navTween = gsap.timeline({
            scrollTrigger: {
                trigger:"#navitem",
                start:'bottom top'

            }
        })
        navTween.fromTo('#navitem',{backgroundColor:'transparent'},{
        backgroundColor:'#00000000',
         backdropFilter: 'blur(8px)',
         
        duration:1,
        ease:'power1.inOut'
        })
    })
  const filteringcategory = (value) => {
  setcategoryfilter((prev) => {
    if (prev.includes(value)) {
      return prev.filter((item) => item !== value);
    }

    return [...prev, value];
  });
};
const getMinPrice = (plant) => {
  if (Array.isArray(plant.variants)) {
    const prices = plant.variants
      .map(v => Number(v.price))
      .filter(p => !isNaN(p));

    return prices.length ? Math.min(...prices) : Number(plant.price) || 0;
  }

  return Number(plant.price) || 0;
};

  useEffect(() => {
    getPlants().then((data) => {
      setPlants(data.data);
    });
  }, []);
  const [filterplant , setfilterplant] = useState([])
 
  const filter = ()=>{
    let plantscopy = plants?.slice()
  
    plantscopy = plantscopy.filter((e)=>e.name?.toLowerCase().includes(search.toLowerCase()))
   if(categoryfilter.length > 0){
   plantscopy = plantscopy.filter(item =>
  item.category?.some(cat => categoryfilter.includes(cat))
);
  }
   if (price === 'LOW TO HIGH') {
  plantscopy.sort((a, b) => 
  Number(getMinPrice(a)) - Number(getMinPrice(b))
);
} 
else if (price === 'HIGH TO LOW') {
  plantscopy.sort((a, b) => 
  Number(getMinPrice(b)) - Number(getMinPrice(a))
);
}
  setfilterplant(()=>(plantscopy))
  }
 useEffect(() => {
  filter();
}, [search, plants, categoryfilter, price]);

  return (
    <div  className="font-body-md bg-gradient-to-br from-[#162D24] to-[#1B4732] text-body-md">
  <Animation/> 
<header id="navitem"  className="   border-[#d1c4a1] full-width top-0   sticky z-50">
<div className="md:flex  items-center text-center md:justify-between w-full px-10 py-3 md:py-6 max-w-[1440px] mx-auto">
<a className="text-4xl text-[#d1c4a1]   dancing-script-true  " href="#">The Imperial Garden</a>     

<nav className="hidden md:flex   gap-8 items-center">
<Link className="dancing-script-true text-3xl text-center text-[#d1c4a1] uppercase   border-b  pb-1 cursor-pointer transition-all active:scale-95" >Catalog</Link>

</nav>
</div>


<div className="w-full h-px bg-[#d1c4a1]/20" />
</header>
<main className="max-w-[1440px] pb-20 text-[#eadebf]   mx-auto px-6 pt-stack-lg">

<section className="mb-stack-lg mb-20 pb-stack-md">

<div className="max-w-2xl">

<p className=" manrope-true mt-10 text-lg   text-outline mt-stack-sm leading-relaxed">
                        A thoughtfully selected collection of fresh, healthy plants, grown with care and presented with clarity and understated elegance.
                    </p>
</div>

<div className="flex mt-20  flex-col">
<div className="flex items-start gap-6 flex-wrap pb-2">
  <span className="text-label-caps text-[#d1c4a1]/60 text-xs tracking-widest pt-1">
    FILTER BY:
  </span>

  {/* Checkboxes */}
  <div className="flex gap-6 flex-wrap">

    {/* ALL SPECIES */}
    <label   onClick={() => setcategoryfilter([])} className="flex items-center gap-2 cursor-pointer group">
      <div
       
        className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all duration-200 cursor-pointer
          ${categoryfilter.length === 0
            ? 'bg-[#d1c4a1] border-[#d1c4a1]'   // checked
            : 'border-[#d1c4a1]/40 group-hover:border-[#d1c4a1]'  // unchecked
          }`}
      >
        {categoryfilter.length === 0 && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="#162D24" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </div>
      <span className={`text-xs tracking-widest uppercase transition-colors duration-200
        ${categoryfilter.length === 0 ? 'text-[#d1c4a1]' : 'text-[#d1c4a1]/50 group-hover:text-[#d1c4a1]/80'}`}>
        All Species
      </span>
    </label>

    {/* INDOOR */}
    <label  onClick={() => filteringcategory('Indoor')} className="flex items-center gap-2 cursor-pointer group">
      <div
       
        className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all duration-200 cursor-pointer
          ${categoryfilter.includes('Indoor')
            ? 'bg-[#d1c4a1] border-[#d1c4a1]'
            : 'border-[#d1c4a1]/40 group-hover:border-[#d1c4a1]'
          }`}
      >
        {categoryfilter.includes('Indoor') && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="#162D24" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </div>
      <span className={`text-xs tracking-widest uppercase transition-colors duration-200
        ${categoryfilter.includes('Indoor') ? 'text-[#d1c4a1]' : 'text-[#d1c4a1]/50 group-hover:text-[#d1c4a1]/80'}`}>
        Indoor
      </span>
    </label>

    {/* OUTDOOR */}
    <label  onClick={() => filteringcategory('Outdoor')}  className="flex items-center gap-2 cursor-pointer group">
      <div id="out"
      
        className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all duration-200 cursor-pointer
          ${categoryfilter.includes('Outdoor')
            ? 'bg-[#d1c4a1] border-[#d1c4a1]'
            : 'border-[#d1c4a1]/40 group-hover:border-[#d1c4a1]'
          }`}
      >
        {categoryfilter.includes('Outdoor') && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="#162D24" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </div>
      <span id="out" className={`text-xs tracking-widest uppercase transition-colors duration-200
        ${categoryfilter.includes('Outdoor') ? 'text-[#d1c4a1]' : 'text-[#d1c4a1]/50 group-hover:text-[#d1c4a1]/80'}`}>
        Outdoor
      </span>
    </label>
    <label onClick={() => filteringcategory('Vastu')} className="flex items-center gap-2 cursor-pointer group">
  <div
    className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all duration-200 cursor-pointer
      ${categoryfilter.includes('Vastu')
        ? 'bg-[#d1c4a1] border-[#d1c4a1]'
        : 'border-[#d1c4a1]/40 group-hover:border-[#d1c4a1]'
      }`}
  >
    {categoryfilter.includes('Vastu') && (
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.5 6.5L9 1" stroke="#162D24" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )}
  </div>
  <span className={`text-xs tracking-widest uppercase transition-colors duration-200
    ${categoryfilter.includes('Vastu') ? 'text-[#d1c4a1]' : 'text-[#d1c4a1]/50 group-hover:text-[#d1c4a1]/80'}`}>
    Vastu
  </span>
</label>
<label onClick={() => filteringcategory('Semi-Indoor')} className="flex items-center gap-2 cursor-pointer group">
  <div
    className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all duration-200 cursor-pointer
      ${categoryfilter.includes('Semi-Indoor')
        ? 'bg-[#d1c4a1] border-[#d1c4a1]'
        : 'border-[#d1c4a1]/40 group-hover:border-[#d1c4a1]'
      }`}
  >
    {categoryfilter.includes('Semi-Indoor') && (
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.5 6.5L9 1" stroke="#162D24" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )}
  </div>
  <span className={`text-xs tracking-widest uppercase transition-colors duration-200
    ${categoryfilter.includes('Semi-Indoor') ? 'text-[#d1c4a1]' : 'text-[#d1c4a1]/50 group-hover:text-[#d1c4a1]/80'}`}>
    Semi-Indoor
  </span>
</label>
<label onClick={() => filteringcategory('Aquatic')} className="flex items-center gap-2 cursor-pointer group">
  <div
    className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all duration-200 cursor-pointer
      ${categoryfilter.includes('Aquatic')
        ? 'bg-[#d1c4a1] border-[#d1c4a1]'
        : 'border-[#d1c4a1]/40 group-hover:border-[#d1c4a1]'
      }`}
  >
    {categoryfilter.includes('Aquatic') && (
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.5 6.5L9 1" stroke="#162D24" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )}
  </div>
  <span className={`text-xs tracking-widest uppercase transition-colors duration-200
    ${categoryfilter.includes('Aquatic') ? 'text-[#d1c4a1]' : 'text-[#d1c4a1]/50 group-hover:text-[#d1c4a1]/80'}`}>
    Aquatic
  </span>
</label>
<label onClick={() => filteringcategory('Desert')} className="flex items-center gap-2 cursor-pointer group">
  <div
    className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all duration-200 cursor-pointer
      ${categoryfilter.includes('Desert')
        ? 'bg-[#d1c4a1] border-[#d1c4a1]'
        : 'border-[#d1c4a1]/40 group-hover:border-[#d1c4a1]'
      }`}
  >
    {categoryfilter.includes('Desert') && (
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.5 6.5L9 1" stroke="#162D24" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )}
  </div>
  <span className={`text-xs tracking-widest uppercase transition-colors duration-200
    ${categoryfilter.includes('Desert') ? 'text-[#d1c4a1]' : 'text-[#d1c4a1]/50 group-hover:text-[#d1c4a1]/80'}`}>
    Desert
  </span>
</label>
<label onClick={() => filteringcategory('Hanging')} className="flex items-center gap-2 cursor-pointer group">
  <div
    className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all duration-200 cursor-pointer
      ${categoryfilter.includes('Hanging')
        ? 'bg-[#d1c4a1] border-[#d1c4a1]'
        : 'border-[#d1c4a1]/40 group-hover:border-[#d1c4a1]'
      }`}
  >
    {categoryfilter.includes('Hanging') && (
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.5 6.5L9 1" stroke="#162D24" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )}
  </div>
  <span className={`text-xs tracking-widest uppercase transition-colors duration-200
    ${categoryfilter.includes('Hanging') ? 'text-[#d1c4a1]' : 'text-[#d1c4a1]/50 group-hover:text-[#d1c4a1]/80'}`}>
    Hanging
  </span>
</label>
<label onClick={() => filteringcategory('Medicinal')} className="flex items-center gap-2 cursor-pointer group">
  <div
    className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all duration-200 cursor-pointer
      ${categoryfilter.includes('Medicinal')
        ? 'bg-[#d1c4a1] border-[#d1c4a1]'
        : 'border-[#d1c4a1]/40 group-hover:border-[#d1c4a1]'
      }`}
  >
    {categoryfilter.includes('Medicinal') && (
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.5 6.5L9 1" stroke="#162D24" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )}
  </div>
  <span className={`text-xs tracking-widest uppercase transition-colors duration-200
    ${categoryfilter.includes('Medicinal') ? 'text-[#d1c4a1]' : 'text-[#d1c4a1]/50 group-hover:text-[#d1c4a1]/80'}`}>
    Medicinal
  </span>
</label>
<label onClick={() => filteringcategory('Food')} className="flex items-center gap-2 cursor-pointer group">
  <div
    className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all duration-200 cursor-pointer
      ${categoryfilter.includes('Food')
        ? 'bg-[#d1c4a1] border-[#d1c4a1]'
        : 'border-[#d1c4a1]/40 group-hover:border-[#d1c4a1]'
      }`}
  >
    {categoryfilter.includes('Food') && (
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.5 6.5L9 1" stroke="#162D24" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )}
  </div>
  <span className={`text-xs tracking-widest uppercase transition-colors duration-200
    ${categoryfilter.includes('Food') ? 'text-[#d1c4a1]' : 'text-[#d1c4a1]/50 group-hover:text-[#d1c4a1]/80'}`}>
    Food
  </span>
</label>

  </div>
</div>
<div className="flex items-center gap-6 flex-wrap pb-2">
  <span className="text-[#d1c4a1]/60 text-xs tracking-widest uppercase">SORT BY:</span>

  {/* Default — No sort */}
  <label className="flex items-center gap-2 cursor-pointer group" onClick={() => setPrice('PRICE')}>
    <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all
      ${price === 'PRICE' ? 'bg-[#d1c4a1] border-[#d1c4a1]' : 'border-[#d1c4a1]/40 group-hover:border-[#d1c4a1]'}`}>
      {price === 'PRICE' && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="#162D24" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )}
    </div>
    <span className={`text-xs tracking-widest uppercase transition-colors
      ${price === 'PRICE' ? 'text-[#d1c4a1]' : 'text-[#d1c4a1]/50 group-hover:text-[#d1c4a1]/80'}`}>
      Default
    </span>
  </label>

  {/* Low to High / High to Low */}
  {priceOptions.map((option) => (
    <label key={option} className="flex items-center gap-2 cursor-pointer group" onClick={() => setPrice(option)}>
      <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all
        ${price === option ? 'bg-[#d1c4a1] border-[#d1c4a1]' : 'border-[#d1c4a1]/40 group-hover:border-[#d1c4a1]'}`}>
        {price === option && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="#162D24" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </div>
      <span className={`text-xs tracking-widest uppercase transition-colors
        ${price === option ? 'text-[#d1c4a1]' : 'text-[#d1c4a1]/50 group-hover:text-[#d1c4a1]/80'}`}>
        {option}
      </span>
    </label>
  ))}
</div>
<div className=' rounded-2xl w-3/4  h-auto flex justify-between items-center  bg-transparent border border-[#d1c4a1]'>
      <input type="text" onChange={(e)=>setsearch(e.target.value)} className='w-full px-3 py-2 outline-none rounded-2xl' placeholder='Search' />
</div>
</div>

    



</section>

<section className="grid  grid-cols-1 playfair-display-true md:grid-cols-2 lg:grid-cols-3 gap-x-12  gap-y-12">
{filterplant.map((plant) => {
    const matchedCategories = plant.category?.filter(cat =>
  categoryfilter.includes(cat)
);
//     const sizes = plant.size?.split("/").sort(
//     (a, b) => parseFloat(a) - parseFloat(b)
//   ) || [];

//   const displaySize =
//     sizes.length > 1
//       ? `${sizes[0]} - ${sizes[sizes.length - 1]}`
//       : sizes[0] || "";
return (
<Link to={`/plant/${plant._id}`}>
<article key={plant._id} className="group  cursor-pointer">
<div className="relative overflow-hidden aspect-[4/5] bg-surface-container-low mb-stack-sm">
 <img alt="Strelitzia Reginae" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="Exquisite close-up of a Bird of Paradise plant leaf with dramatic side lighting highlighting its architectural veins and vibrant green color." src={plant.imageUrl}/>
{/* <div className="absolute top-4 right-4">
<span className="bg-secondary-container text-on-secondary-fixed font-label-caps text-[10px] px-3 py-1 uppercase">Limited Stock</span>
</div> */}
</div>
<div className="flex mt-1 flex-row justify-between gap-1">
    <div className="flex  flex-col px-1 mb-1">
<div className="font-label-caps capitalize text-label-caps text-on-secondary-container">{plant.scientificName}</div>
<h2 className="font-headline-md capitalize text-headline-md text-primary">{plant.name}</h2>
{/* <p className="font-body-md text-body-md text-outline italic">Sizes : {plant.size
      ? (() => {
          const s = plant.size.split("/");
          return s.length > 1 ? `${s[0]} - ${s[s.length - 1]}` : s[0];
        })()
      : ""}</p> */}
</div>
<div classNameName="px-2">
    {plant.variants?.length > 0 ?  <div className="font-body-lg text-body-lg  text-primary">From  ₹{Math.min(...plant.variants.map(v => Number(v.price)))}</div> : 
<div className="font-body-lg text-body-lg  text-primary">₹{plant.price}</div>
}
</div>
</div>
<div className="grid gap-20 grid-cols-3  mt-stack-sm pt-1  border-t border-primary/5">
<div className="flex items-center gap-1 text-on-surface-variant">
<span className="material-symbols-outlined text-[18px]" data-icon="wb_sunny"><Sun/></span>
<span className="font-label-caps capitalize text-[12px]">{plant.careDetails?.sunlight}</span>

</div>
<div className="flex items-center gap-1 text-on-surface-variant">
<span className="material-symbols-outlined text-[18px]" data-icon="opacity"><Droplet/></span>
<span className="font-label-caps capitalize text-[12px]">{plant.careDetails?.watering}</span>


</div>
<div className="flex items-center gap-1 text-on-surface-variant">


{categoryfilter.length > 0 ? (
    <span className=" gap-1  capitalize text-[17px]">
      {plant.category
        ?.filter(cat => categoryfilter.includes(cat))
        .map((cat, i) => (
          <span
            key={i}
            className=""
          >
            {cat}{i !== plant.category.length - 1 && " "}
          </span>
        ))}
    </span>
  ) : <span className="material-symbols-outlined gap-1 capitalize text-[17px]" data-icon="opacity">{plant.category?.[0]}</span>}


</div>
</div>
</article>
</Link>
)})}








</section>


</main>

<Footer/>
</div>
  )
}

export default PlantCatalog;