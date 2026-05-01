import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlantById } from "../Helper/api.js";
import { Link } from "react-router-dom";
import { Sun } from "lucide-react";
import Footer from "../Components/Footer.jsx";
import { ThermometerSun } from 'lucide-react';
import { Droplet } from "lucide-react";
import gsap from "gsap";
// ✅ Add at the top of Individual.jsx
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from "@gsap/react";

function PlantDetails() {
    const { id } = useParams();
    
    const [plant, setPlant] = useState(null);
 useEffect(() => {
    if (!plant) return; // wait for plant data first

    const handleScroll = () => {
      if (window.scrollY > 10) {
        gsap.to('#navitems', {
          backgroundColor: '#00000000',
          backdropFilter: 'blur(8px)',
         
          duration: 0.2,
          ease: 'power1.inOut'
        });
      } else {
        gsap.to('#navitems', {
          backgroundColor: 'transparent',
          backdropFilter: 'blur(7px)',
          webkitBackdropFilter: 'blur(0px)',
          duration: 0.5,
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // cleanup
  }, [plant]);
  useEffect(() => {
    getPlantById(id).then((data) => {
      setPlant(data.data);
    });
  }, [id]);
const paragraphs = plant?.description.split("\n\n");
  if (!plant) return <p>Loading...</p>;

  return (
    <>
     <div  className="font-body-md bg-gradient-to-br from-[#162D24] to-[#1B4732] text-body-md">
  <header id="navitems"  className="   border-[#d1c4a1] full-width top-0   sticky z-50">
<div className="md:flex text-center items-center md:justify-between w-full px-10 lg:px-15 py-3 md:py-6 max-w-[1440px] mx-auto">
<a className="text-4xl text-[#d1c4a1]   dancing-script-true  " href="#">The Imperial Garden</a>     

<nav className="hidden md:flex   gap-8 items-center">
<Link className="dancing-script-true text-3xl text-center text-[#d1c4a1] uppercase   border-b  pb-1 cursor-pointer transition-all active:scale-95" >{plant.category?.map((item)=>(`${item}`)).join(' | ')}</Link>

</nav>
</div>


<div className="w-full h-px bg-[#d1c4a1]/20" />
</header>
  <main className="pt-32 pb-20 px-8 lg:px-15 pb-section-gap px-margin-mobile text-[#d1c4a1] md:px-margin-desktop max-w-[1440px] mx-auto">

<section className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
<div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-12 gap-4">

  {/* Main Image */}
  <div className="lg:col-span-12 h-[400px] sm:h-[400px] lg:h-[550px] overflow-hidden">
    <img
      alt={plant.name}
      className="w-full h-full object-cover transition-all duration-700"
      src={plant.imageUrl}
    />
  </div>

  {/* Variant Images */}
  {plant.variants?.map((item, index) => (
    <div
      key={item._id || index}
      className="h-[200px] sm:h-[250px] lg:col-span-6 lg:h-[300px] overflow-hidden"
    >
      <img
        alt={`variant-${index}`}
        className="w-full h-full object-cover"
        src={item.imageUrl}
      />
    </div>
  ))}

</div>

<div className="md:col-span-5 md:pl-12  top-32 flex flex-col gap-1">
<div>

<h1 className="font-display-xl text-[64px] leading-tight text-on-surface mb-2 capitalize  playfair-display-true">{plant.name}</h1>
<p className="font-headline-md  playfair-display-true text-headline-md italic text-outline mb-2">{plant.scientificName}</p>
{plant.variants?.length > 0 ? <p className=" playfair-display-true   text-2xl "> Prices:- <span className="font-body-lg text-body-lg  text-primary">{plant.variants.map(v => `₹${v.price}`).join('  |  ') }</span> </p>: 
<p className="font-body-lg text-body-lg playfair-display-true text-2xl mb-2  text-primary">Price:- {`₹${plant.price}`}</p>}

</div>
<div className="border-t  playfair-display-true border-secondary/20  pt-2">
<div className="flex flex-col gap-4 mb-10">
<div className="flex justify-between  items-center border-b border-secondary/10 pb-2">
{plant.variants?.length > 0 ? <p className=" playfair-display-true text-2xl "> Sizes:- <span className="font-body-lg text-body-lg  text-primary">{plant.variants.map(v => `${v.size}`).join('  |  ') }</span> </p> : 
<span className="font-body-lg text-2xl text-body-lg  text-primary">Size:- {plant.size}</span>
}
</div>

{/* <p className="font-body-lg text-body-lg text-on-surface-variant mt-10 mb-8"> */}
   <p className="whitespace-pre-line text-[#d1c4a1]">
  {plant.description}
</p>

                    {/* </p>  */}
</div>

</div>


</div>
</section>

<section className="mt-section-gap playfair-display-true mb-20 grid grid-cols-1 md:grid-cols-3 gap-gutter border-t border-secondary/20 pt-16">
<div className="flex flex-row items-center  gap-4">
<div className="flex items-center gap-3 text-secondary ">
<span className="material-symbols-outlined" data-icon="opacity"><Droplet></Droplet></span>
<h3 className="font-label-caps text-lg text-label-caps uppercase">Watering -</h3>
</div>
<div className="font-body-lg text-body-lg capitalize text-lg text-on-surface">{plant.careDetails?.watering}</div>

</div>
<div className="flex flex-row items-center gap-4">
<div className="flex items-center gap-3 text-secondary ">
<span className="material-symbols-outlined" data-icon="light_mode"><Sun/></span>
<h3 className="font-label-caps text-lg  text-label-caps uppercase">Sunlight -</h3>
</div>
<p className="font-body-lg text-lg text-body-lg capitalize text-on-surface">{plant.careDetails?.sunlight}</p>

</div>
<div className="flex flex-row items-center gap-4">
<div className="flex items-center gap-3 text-secondary">
<span className="material-symbols-outlined" data-icon="thermostat"><ThermometerSun></ThermometerSun></span>
<h3 className="font-label-caps text-lg text-label-caps uppercase">Temperature -</h3>
</div>
<p className="font-body-lg text-lg text-center text-on-surface">{plant.careDetails?.temperature} °C</p>

</div>
</section>

<section className="mt-section-gap  grid grid-cols-1 md:grid-cols-12 items-center gap-gutter">
<div className="md:col-span-5 order-2 md:order-1">
<h2 className="font-headline-lg text-headline-lg inter-true text-2xl text-on-surface mb-8">Architectural Splendor from the Tropics</h2>
<p className="font-body-lg poppins-regular mb-6 text-body-lg text-on-surface-variant">
                    {plant.name} is more than a plant. It is a living sculpture that evolves with your space, rewarding the patient observer with dramatic new growth cycles.
                </p>
<p className="font-body-lg text-body-lg poppins-regular text-on-surface-variant mb-6">
                    We focus on providing fresh, healthy plants that are carefully grown and regularly maintained to ensure they reach you in their best possible condition. 
                </p>
<p className="font-body-lg text-body-lg poppins-regular text-on-surface-variant mb-6">
                    Each plant is nurtured with proper care, adequate sunlight, and balanced watering so it develops strong roots and healthy foliage. This ensures that when it arrives at your home or workspace, it is already adapted to thrive and continue growing with ease in your environment.
                </p>
    
</div>
<div className="md:col-span-6 md:col-start-7 order-1 mb-20 md:order-2 h-[500px] overflow-hidden">
<img alt="Artistic botanical" className="w-full h-full  object-cover" data-alt="Moody artistic shot of Monstera leaves in a play of light and shadow, highlighting the architectural shapes and negative space" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsNFoJAIKSEbC_jJN8-XZoVbovxVeLoVkIcMsOXLnXMogF8LJkZ8G3Y4H45Rkna5yDh1tufFWQ_hgdGS8YKvZtDLPgkrUhK1RfSITeVCciT_rgPY9g-QbZaGwe8KrcMTLMoZvR-bvWuWO4CCSlT3hS-lYi3hVpHbxaYc5pY8JHV673k_kPvagp-eKYuhA0q9Q41r1tb4j8tS4tpy1DycoMht2cH71BKCXKlQjoEwE9dJL83xey2u80k9bs1yt03snC5oWjL3EzkqY"/>
</div>
</section>
</main>
<Footer/>
</div>
</>
      );
}

export default PlantDetails;