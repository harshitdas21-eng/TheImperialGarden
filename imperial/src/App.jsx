import { useState,useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlantCatalog from "./Pages/All";
import PlantDetails from "./Pages/Individual";
import Lenis from 'lenis'
import AdminDashboard from './Pages/AdminDash';
import Add from './Pages/Add';
import Animation from './Pages/Gsap';
import './App.css'
import ProtectedRoute from './Helper/protected.jsx';
import Dash from './Components/Dash';
import gsap from 'gsap';

import { ScrollTrigger } from "gsap/ScrollTrigger";
import Edit from './Pages/Edit';
import Login from './Pages/Login';

gsap.registerPlugin(ScrollTrigger);

function App() {  
 useEffect(() => {
    const lenis = new Lenis({
      smooth: true,
      lerp: 0.08,
    
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
  return (
    
       <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlantCatalog />} />
        <Route path="/plant/:id" element={<PlantDetails />} />
        <Route path="/plant/login" element={<Login />} />
        
<Route path="/admin" element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>} >
  
  <Route index element={ 
    <Dash />
  }/>
  
  <Route path='add' element={ <ProtectedRoute>
    <Add />
  </ProtectedRoute>}/>
  <Route path='edit/:id' element={ <ProtectedRoute>
    <Edit />
  </ProtectedRoute>}/>
  </Route>
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
