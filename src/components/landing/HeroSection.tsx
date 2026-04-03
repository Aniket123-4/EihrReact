import { motion } from "framer-motion";
import { ArrowRight, Calendar, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {

  const navigate = useNavigate()
  const cardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.5)',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
    width: '180px',
    textAlign: 'left'
  };

  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '100px', position: 'relative', zIndex: 1 }}>
      <div style={{ textAlign: 'center', maxWidth: '900px', padding: '0 20px' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '20px', background: '#f1f5f9', marginBottom: '24px' }}>
           <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
           <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>NEXT-GEN HOSPITAL MANAGEMENT</span>
        </motion.div>

        <h1 style={{ fontSize: 'clamp(42px, 8vw, 84px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.05, marginBottom: '24px' }}>
          Smart Hospital <span style={{ color: '#38bdf8' }}>Management</span> System
        </h1>

        <p style={{ fontSize: '18px', color: '#64748b', maxWidth: '650px', margin: '0 auto 40px', lineHeight: 1.6 }}>
          Manage patients, appointments, tokens, and billing in real-time. Built for hospitals that demand excellence.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => {navigate('/login') }} style={{ background: '#38bdf8', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Get Started <ArrowRight size={18} />
          </button>
          <button style={{ background: 'white', color: '#0f172a', border: '1px solid #e2e8f0', padding: '16px 32px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            Book Appointment
          </button>
        </div>

        {/* Floating Cards */}
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '80px', flexWrap: 'wrap' }}>
          {[
            { icon: Calendar, label: "Appointments", val: "248", color: "#38bdf8" },
            { icon: Shield, label: "Patients Today", val: "1,024", color: "#6366f1" },
            { icon: Zap, label: "Avg Wait", val: "4 min", color: "#fb923c" }
          ].map((item, i) => (
            <motion.div key={i} style={cardStyle} whileHover={{ y: -10 }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: `${item.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <item.icon color={item.color} size={20} />
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{item.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0 0', color: '#0f172a' }}>{item.val}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
