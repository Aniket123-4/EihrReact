import { motion } from "framer-motion";
import { Users, Calendar, ClipboardList, Stethoscope, CreditCard, FileText, Shield, MonitorSmartphone } from "lucide-react";

const features = [
  { icon: Users, title: "Patient Management", desc: "Complete patient records with instant access and smart search." },
  { icon: Calendar, title: "Appointment Scheduling", desc: "Real-time slot booking with automated reminders." },
  { icon: ClipboardList, title: "Token System", desc: "Live queue management with estimated wait times." },
  { icon: Stethoscope, title: "Doctor Panel", desc: "Streamlined consultations and digital prescriptions." },
  { icon: CreditCard, title: "Smart Billing", desc: "Automated invoicing with insurance integration." },
  { icon: FileText, title: "Documents", desc: "Secure uploads with OCR and smart categorization." },
  { icon: Shield, title: "Data Security", desc: "HIPAA-compliant with end-to-end encryption." },
  { icon: MonitorSmartphone, title: "Multi-device", desc: "Responsive design that works on any device." },
];

const FeaturesSection = () => {
  return (
    <section id="features" style={{ padding: '100px 24px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a' }}>Everything You <span style={{ color: '#38bdf8' }}>Need</span></h2>
          <p style={{ color: '#64748b', fontSize: '18px' }}>Comprehensive tools built for modern healthcare facilities.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -8 }}
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                padding: '30px',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <f.icon color="#38bdf8" size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#0f172a' }}>{f.title}</h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
