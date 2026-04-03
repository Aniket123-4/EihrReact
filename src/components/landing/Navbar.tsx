import { motion } from "framer-motion";
import { Activity, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ThemeSwitcher from "../ThemeSwitcher";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const links = ["Features", "How it Works", "Dashboard", "Contact"];

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '72px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 24px',
    background: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
    zIndex: 1000
  };

  return (
    <motion.nav style={navStyle} initial={{ y: -100 }} animate={{ y: 0 }}>
      <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #38bdf8, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity color="white" size={20} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '22px', color: '#0f172a', letterSpacing: '-0.5px' }}>MediFlow</span>
        </Link>

        {/* Desktop Menu */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} style={{ textDecoration: 'none', color: '#64748b', fontSize: '14px', fontWeight: 500 }}>{l}</a>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeSwitcher />
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontWeight: 500, padding: '8px 16px' }}>Sign In</button>
          </Link>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button style={{ 
              background: '#38bdf8', 
              color: 'white', 
              border: 'none', 
              padding: '10px 22px', 
              borderRadius: '10px', 
              fontWeight: 600, 
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)'
            }}>Get Started</button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
