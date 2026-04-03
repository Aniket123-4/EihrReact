import React from "react";
import CityBackground from "../components/landing/CityBackground";
import CursorGlow from "../components/landing/CursorGlow";
import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import PatientFlowSection from "../components/landing/PatientFlowSection";
import StatsSection from "../components/landing/StatsSection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";

const Index = () => {
  // Tailwind classes replacement with Inline CSS
  const mainWrapperStyle: React.CSSProperties = {
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    overflowX: 'hidden',
    backgroundColor: '#f8fafc', // Light fallback background
    display: 'flex',
    flexDirection: 'column',
  };

  const contentAreaStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1, // Background layers (0) se upar rakhne ke liye
    width: '100%',
  };

  return (
    <div style={mainWrapperStyle}>
      {/* 1. Background Layers (Fixed positioning logic inside components) */}
      <CityBackground />
      <CursorGlow />

      {/* 2. Header Layer (Fixed at top) */}
      <Navbar />

      {/* 3. Main Scrollable Content */}
      <main style={contentAreaStyle}>
        <HeroSection />
        <FeaturesSection />
        <PatientFlowSection />
        <StatsSection />
        <CTASection />
      </main>

      {/* 4. Footer Layer */}
      <Footer />
    </div>
  );
};

export default Index;
