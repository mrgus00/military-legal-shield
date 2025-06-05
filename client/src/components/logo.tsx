import logoImage from "@assets/SoF Logo.png";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function Logo({ className = "", width = 120, height = 120 }: LogoProps) {
  return (
    <img 
      src={logoImage} 
      alt="MilitaryLegalShield - Military Legal Defense Platform Logo"
      className={`object-contain ${className}`}
      width={width}
      height={height}
    />
  );
}