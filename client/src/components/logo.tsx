import { Link } from "wouter";
import logoImage from "@assets/SoF_1749525410011.png";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  clickable?: boolean;
}

export default function Logo({ className = "", width = 120, height = 120, clickable = true }: LogoProps) {
  const logoElement = (
    <img 
      src={logoImage} 
      alt="Soldier on Fire - MilitaryLegalShield Home"
      className={`object-contain ${clickable ? 'hover:opacity-80 transition-opacity cursor-pointer' : ''} ${className}`}
      width={width}
      height={height}
    />
  );

  if (clickable) {
    return (
      <Link href="/" className="inline-block">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
}