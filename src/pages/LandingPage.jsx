import HeroSection from '../components/landing/HeroSection';
import AlgorithmShowcase from '../components/landing/AlgorithmShowcase';
import DifferentiatorSection from '../components/landing/DifferentiatorSection';
import WorkflowTimeline from '../components/landing/WorkflowTimeline';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <HeroSection />
      <AlgorithmShowcase />
      <DifferentiatorSection />
      <WorkflowTimeline />
      
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            STRING<span style={{color: 'var(--accent-cyan)'}}>XPERT</span>
          </div>
          <p className="text-muted" style={{fontSize: '0.85rem', marginTop: '1rem'}}>
            Multi-Algorithm Text Similarity Engine
          </p>
        </div>
      </footer>
    </div>
  );
}
