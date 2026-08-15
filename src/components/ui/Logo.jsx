export default function Logo() {
  return (
    <div className="logo-container" style={{
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: "1.25rem",
      letterSpacing: "-0.03em",
      display: "flex",
      alignItems: "center",
      userSelect: "none"
    }}>
      <span style={{ 
        color: "var(--text-primary)",
        textShadow: "0 2px 10px rgba(255,255,255,0.1)"
      }}>STRING</span>
      <span style={{ 
        color: "var(--accent-cyan)",
        textShadow: "0 0 15px var(--accent-cyan-glow)"
      }}>XPERT</span>
    </div>
  );
}
