import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const AnimatedCounter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref:any = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = target;
      const duration = 2000;
      const increment = end / (duration / 16);
      const timer:any = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);
    }
  }, [inView, target]);

  return <span ref={ref}>{Math.floor(count).toLocaleString()}{suffix}</span>;
};

const StatsSection = () => {
  const stats = [
    { value: 50000, suffix: "+", label: "Patients Managed" },
    { value: 120, suffix: "+", label: "Hospitals Trust Us" },
    { value: 99, suffix: "%", label: "Uptime" },
    { value: 4, suffix: "m", label: "Avg Wait Time" },
  ];

  return (
    <section style={{ padding: '80px 24px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', background: '#0f172a', padding: '60px 40px', borderRadius: '30px', color: 'white', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '40px' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '48px', fontWeight: 800, margin: 0, color: '#38bdf8' }}>
              <AnimatedCounter target={s.value} suffix={s.suffix} />
            </h3>
            <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '14px', fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
