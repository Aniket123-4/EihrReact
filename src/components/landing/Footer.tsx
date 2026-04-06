import { Activity } from "lucide-react";

const Footer = () => {
  return (
    <footer style={{ borderTop: '1px solid #e2e8f0', padding: '80px 24px 40px', position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.5)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '80px', marginBottom: '60px' }}>
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity color="white" size={16} />
              </div>
              <span style={{ fontWeight: 'bold', fontSize: '20px' }}>Vaidhyaraj Madan Mohan Singh Portal
</span>
            </div>
            <p style={{ color: '#64748b', lineHeight: 1.6 }}>Next-generation hospital management for modern healthcare facilities.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ marginBottom: '20px', fontSize: '14px' }}>Product</h4>
              <ul style={{ listStyle: 'none', padding: 0, color: '#64748b', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li>Features</li><li>Pricing</li><li>Security</li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: '20px', fontSize: '14px' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0, color: '#64748b', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li>About</li><li>Careers</li><li>Contact</li>
              </ul>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', paddingTop: '40px', borderTop: '1px solid #f1f5f9' }}>
          © 2026 Vaidhyaraj Madan Mohan Singh Portal
. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
