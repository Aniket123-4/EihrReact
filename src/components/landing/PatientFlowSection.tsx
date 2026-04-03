import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MonitorSmartphone, UserCheck, UserPlus, ClipboardCheck, Stethoscope, CheckCircle } from "lucide-react";
import { useState } from "react";

const PatientFlowSection = () => {
  const [isOffline, setIsOffline] = useState(false);

  const containerStyle: React.CSSProperties = {
    padding: '100px 24px',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1
  };

  const steps = isOffline 
    ? [
        { icon: UserPlus, label: "Walk-in Registration" },
        { icon: ClipboardCheck, label: "Token Assigned" },
        { icon: Stethoscope, label: "Consultation" },
        { icon: CheckCircle, label: "Billing & Discharge" }
      ]
    : [
        { icon: MonitorSmartphone, label: "Online Booking" },
        { icon: UserCheck, label: "Identity Verified" },
        { icon: Stethoscope, label: "Consultation" },
        { icon: CheckCircle, label: "Digital Summary" }
      ];

  return (
    <section style={containerStyle} id="how-it-works">
      <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '40px' }}>Patient <span style={{ color: '#38bdf8' }}>Journey</span></h2>
      
      {/* Toggle Button */}
      <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '6px', borderRadius: '50px', marginBottom: '60px', border: '1px solid #e2e8f0' }}>
        <button 
          onClick={() => setIsOffline(false)}
          style={{ padding: '10px 30px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: 600, background: !isOffline ? '#38bdf8' : 'transparent', color: !isOffline ? 'white' : '#64748b' }}
        >Online</button>
        <button 
          onClick={() => setIsOffline(true)}
          style={{ padding: '10px 30px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: 600, background: isOffline ? '#38bdf8' : 'transparent', color: isOffline ? 'white' : '#64748b' }}
        >Walk-in</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <AnimatePresence mode="wait">
          <motion.div key={isOffline ? 'off' : 'on'} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: 'white', padding: '24px', borderRadius: '20px', width: '160px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                  <div style={{ width: '40px', height: '40px', background: '#f0f9ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <step.icon color="#38bdf8" size={20} />
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>{step.label}</p>
                </div>
                {i < steps.length - 1 && <ArrowRight color="#cbd5e1" size={20} />}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PatientFlowSection;
