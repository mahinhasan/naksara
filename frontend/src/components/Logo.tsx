import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  light?: boolean;
}

export default function Logo({ className = '', iconOnly = false, light = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 font-sans ${className}`}>
      {/* Premium Geometric Logo Icon */}
      <svg
        className={`w-8 h-8 ${light ? 'text-white' : 'text-black'}`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Hexagon / Geometric Diamond */}
        <polygon
          points="50,5 90,28 90,72 50,95 10,72 10,28"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Inner Stylized N-shape / Origami folds */}
        <path
          d="M30,72 L30,28 L50,55 L70,28 L70,72"
          stroke="currentColor"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Subtle decorative dot */}
        <circle cx="50" cy="74" r="5" fill="currentColor" />
      </svg>

      {!iconOnly && (
        <span
          className={`font-serif tracking-[0.25em] text-lg font-bold uppercase transition-colors duration-200 ${
            light ? 'text-white' : 'text-black'
          }`}
        >
          Naksara
        </span>
      )}
    </div>
  );
}
