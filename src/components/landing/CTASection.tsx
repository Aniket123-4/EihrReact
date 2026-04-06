import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  const sectionStyle: React.CSSProperties = {
    padding: '100px 24px',
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center'
  };

  const glassCardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '1100px',
    position: 'relative',
    padding: '80px 40px',
    borderRadius: '40px',
    textAlign: 'center',
    overflow: 'hidden',
    background: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
  };

  const backgroundGradient: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(99, 102, 241, 0.1) 50%, rgba(244, 114, 182, 0.1) 100%)',
    zIndex: -1
  };

  return (
    <section style={sectionStyle}>
      <motion.div 
        style={glassCardStyle}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Decorative background element */}
        <div style={backgroundGradient} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ 
            fontSize: 'clamp(32px, 5vw, 56px)', 
            fontWeight: 800, 
            color: '#0f172a', 
            marginBottom: '20px',
            lineHeight: 1.2
          }}>
            Ready to <span style={{ color: '#38bdf8' }}>Transform</span> Your Hospital?
          </h2>
          
          <p style={{ 
            fontSize: '18px', 
            color: '#64748b', 
            maxWidth: '600px', 
            margin: '0 auto 40px',
            lineHeight: 1.6
          }}>
            Join hundreds of hospitals already using Vaidhyaraj Madan Mohan Singh Portal
 to deliver better patient care and streamline operations.
          </p>

          <Link to="/login" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(56, 189, 248, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: '#38bdf8',
                color: 'white',
                border: 'none',
                padding: '18px 40px',
                borderRadius: '16px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s ease'
              }}
            >
              Start Free Trial <ArrowRight size={22} />
            </motion.button>
          </Link>

          {/* Bottom badge */}
          <p style={{ marginTop: '24px', fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
