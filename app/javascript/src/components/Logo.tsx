import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = '', size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle - uses CSS variable for theme color */}
      <circle cx="256" cy="256" r="256" className="logo-bg" />

      {/* Simple budgie bird silhouette */}
      {/* Head */}
      <ellipse cx="256" cy="200" rx="80" ry="70" className="logo-bird" />

      {/* Body */}
      <ellipse cx="256" cy="280" rx="90" ry="100" className="logo-bird" />

      {/* Wing (left) */}
      <ellipse cx="200" cy="280" rx="50" ry="80" className="logo-bird" opacity="0.9" />

      {/* Wing (right) */}
      <ellipse cx="312" cy="280" rx="50" ry="80" className="logo-bird" opacity="0.9" />

      {/* Beak */}
      <path d="M 200 200 Q 180 210 175 200 Q 180 190 200 200" className="logo-bird" />

      {/* Eye */}
      <circle cx="240" cy="190" r="12" className="logo-eye" />
      <circle cx="240" cy="190" r="6" className="logo-bird" />

      {/* Tail feather */}
      <ellipse cx="256" cy="360" rx="20" ry="60" className="logo-bird" opacity="0.8" />
    </svg>
  );
}
