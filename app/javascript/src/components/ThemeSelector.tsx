import React from 'react';
import { useTheme, Theme } from '../hooks/useTheme';
import SunIcon from '/icons/sun.svg';
import MoonIcon from '/icons/moon.svg';
import HeartIcon from '/icons/heart.svg';

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const themes: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: SunIcon },
    { value: 'dark', label: 'Dark', icon: MoonIcon },
    { value: 'pink', label: 'Pink', icon: HeartIcon },
  ];

  return (
    <div className="theme-selector">
      <div className="theme-selector-buttons">
        {themes.map((t) => (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={`theme-selector-button ${theme === t.value ? 'active' : ''}`}
            aria-label={`Switch to ${t.label} theme`}
            title={t.label}
          >
            <img src={t.icon} alt={t.label} className="theme-selector-icon" />
          </button>
        ))}
      </div>
    </div>
  );
}
