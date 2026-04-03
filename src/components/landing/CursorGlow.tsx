import { useEffect, useState } from "react";

const CursorGlow = () => {
  const [pos, setPos] = useState({ x: -400, y: -400 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const glowStyle: React.CSSProperties = {
    position: 'fixed',
    left: pos.x,
    top: pos.y,
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(99, 102, 241, 0.05) 30%, transparent 70%)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none', // Takki clicks niche pass ho sakein
    zIndex: 0,
    transition: 'left 0.1s ease-out, top 0.1s ease-out', // Smooth movement ke liye
    display: 'block'
  };

  // Mobile par aksar cursor nahi hota, isliye sirf desktop par dikhayein (optional)
  if (typeof window !== 'undefined' && window.innerWidth < 768) return null;

  return <div style={glowStyle} />;
};

export default CursorGlow;
