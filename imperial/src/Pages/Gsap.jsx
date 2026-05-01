import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, useState } from 'react';

export default function Animation({ onComplete }) {
  const loaderRef = useRef();
  const spinnerRef = useRef();
  const textRef = useRef();
  const counterRef = useRef();
  const [count, setCount] = useState(0);

  useGSAP(() => {
    const hasPlayed = localStorage.getItem("loaderPlayed");

  if (hasPlayed) {
    loaderRef.current.style.display = "none";
    return;
  }
       document.body.style.overflow = 'hidden';
    const tl = gsap.timeline(
        {once: true}
    );
    // Counter object — GSAP tweens the value, React state updates it
    const counter = { val: 0 };

    // Step 1 — Spinner spins in
    tl.fromTo(spinnerRef.current,
      { opacity: 0, scale: 0.5, rotation: 0 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
    )

    // Step 2 — Spinner rotates + counter climbs simultaneously
    .to(spinnerRef.current, {
      rotation: 360,
      duration: 1,
      ease: 'power1.inOut',
      repeat: 2,
    })

    // Counter runs alongside spinner (use '<' to start at same time)
    .to(counter, {
      val: 100,
      duration: 3,              // matches total spinner duration
      ease: 'power1.inOut',
      // Snaps to these specific values for realistic feel
      snap: { val: 1 },
      onUpdate: () => {
        // Custom eased stops — feels like real loading
        const raw = Math.round(counter.val);
        setCount(raw);
      }
    }, '<')                     // '<' means start at same time as spinner

    // Step 3 — Spinner + counter fade out
    .to([spinnerRef.current, counterRef.current], {
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      ease: 'power2.in'
    })

    // Step 4 — "True Nature" text reveals
    .fromTo(textRef.current,
      { opacity: 0, letterSpacing: '0.5em', scale: 0.8 },
      { opacity: 1, letterSpacing: '0.15em', scale: 1, duration: 1.2, ease: 'power3.out' }
    )

    // Step 5 — Hold
    .to({}, { duration: 0.8 })

    
    .to(loaderRef.current, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 1.2,
      ease: 'power4.inOut',
      
      onComplete: () => {
    document.body.style.overflow = '';
    localStorage.setItem("loaderPlayed", "true");
  // ✅ inside the function
    onComplete();                        // ✅ then call parent callback
  }
    });

  }, []);


  return (
    <div
      ref={loaderRef}
      style={{ clipPath: 'inset(0 0 0% 0)' }}
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#162D24] to-[#1B4732] flex flex-col items-center justify-center"
    >
      {/* Spinner + Counter together */}
      <div ref={spinnerRef} className="relative mb-12 flex items-center justify-center">
        
        {/* Spinning SVG */}
        <svg
          className="animate-none"
          width="80" height="80"
          viewBox="0 0 80 80"
          fill="none"
        >
          <circle
            cx="40" cy="40" r="34"
            stroke="#d1c4a1"
            strokeWidth="1"
            strokeDasharray="50 25"
            strokeLinecap="round"
          />
          <circle
            cx="40" cy="40" r="22"
            stroke="#d1c4a1"
            strokeWidth="0.5"
            strokeDasharray="25 12"
            strokeLinecap="round"
          />
        </svg>

        {/* Number in center of spinner */}
        </div>
        <div
          ref={counterRef}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-[#d1c4a1] text-lg font-light tracking-widest">
            {count}
          </span>
        </div>

    

      {/* True Nature Text */}
      <div ref={textRef} className="opacity-0   text-center">
        <p className="text-[#d1c4a1]/80 text-xl dancing-script-true tracking-[0.4em] uppercase mb-3">
          welcome to
        </p>
        <h1 className="dancing-script-true  text-[#d1c4a1] text-6xl tracking-[0.15em]">
          The Imperial Garden
        </h1>
        <div className="w-24 h-px bg-[#d1c4a1]/30 mx-auto mt-4" />
      </div>
    </div>
  );
}