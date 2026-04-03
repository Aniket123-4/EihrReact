import { motion, AnimatePresence } from "framer-motion";
import { Palette } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTheme, themes } from "../contexts/ThemeContext";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = themes.find((t) => t.id === theme);

  // Styles object for cleaner code
  const styles = {
    container: { position: 'relative' as const },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      backgroundColor: '#fff',
      cursor: 'pointer',
      transition: 'background 0.2s'
    },
    dot: (color: string) => ({
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: color,
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
    }),
    dropdown: {
      position: 'absolute' as const,
      right: 0,
      top: '100%',
      marginTop: '8px',
      width: '240px',
      backgroundColor: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      zIndex: 1000
    },
    menuItem: (isActive: boolean) => ({
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      backgroundColor: isActive ? '#f0f9ff' : 'transparent',
      color: isActive ? '#0284c7' : '#64748b',
      fontWeight: isActive ? '600' : '500',
      transition: 'all 0.2s'
    })
  };

  return (
    <div style={styles.container} ref={ref}>
      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: '#f8fafc' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        style={styles.button}
      >
        <Palette size={20} color="#6366f1" />
        <div style={{ display: 'flex', gap: '4px' }}>
          {current && (
            <>
              <div style={styles.dot(current.colors[0])} />
              <div style={styles.dot(current.colors[1])} />
            </>
          )}
        </div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            style={styles.dropdown}
          >
            <p style={{ fontSize: '12px', color: '#94a3b8', padding: '4px 12px', margin: 0, fontWeight: 'bold' }}>
              🎨 CHOOSE THEME
            </p>
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setOpen(false); }}
                style={styles.menuItem(theme === t.id)}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme === t.id ? '#f0f9ff' : '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme === t.id ? '#f0f9ff' : 'transparent')}
              >
                <span style={{ fontSize: '18px' }}>{t.icon}</span>
                <span style={{ flex: 1, textAlign: 'left' }}>{t.label}</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={styles.dot(t.colors[0])} />
                  <div style={styles.dot(t.colors[1])} />
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;
