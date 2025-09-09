import "./GradiantText.css";

export default function GradientText({
  children,
  className = "",
  colors = ["rgba(169, 51, 18, 1)", "#426ccfff", "#40ffaa", "#4079ff", "#e6ff40ff"],
  animationSpeed = 8,
  showBorder = true
}) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <div className={`animated-gradient-text ${className}`}>
      {showBorder && <div className="gradient-overlay" style={gradientStyle}></div>}
      <div className="text-content" style={gradientStyle}>{children}</div>
    </div>
  );
}
