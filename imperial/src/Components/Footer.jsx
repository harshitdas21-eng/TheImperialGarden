import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
  <footer className="bg-[#FDFCF8]  full-width border-t border-[#1B3022]/10  flat no shadows">
<div className="flex flex-col md:flex-row justify-between items-center w-full px-12 py-16 max-w-[1440px] mx-auto gap-8">
<div className="flex flex-col items-center md:items-start gap-4">
<div className="dancing-script-true  italic text-lg text-[#1B3022] ">The Imperial Garden</div>
<p className="font-serif text-sm tracking-tight text-[#1B3022]/70 ">© 2026 Imperial Edition. All Rights Reserved. Built for Customers.</p>
</div>
<div>
<Link to={'https://theimperialgarden.co.in'} className="font-serif text-sm tracking-tight text-[#1B3022]/70  ">theimperialgarden.co.in</Link>
<div className="font-serif text-sm tracking-tight text-[#1B3022]/70 ">Mail us at - suchismita@theimperialgarden.co.in</div>
</div>
</div>
</footer>
  )
}

export default Footer
