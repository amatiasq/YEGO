import { useState } from 'react';
import { cn } from '../util/cn';
import './YegoHeader.css';

export interface YegoHeaderProps {
  className?: string;
}

export function YegoHeader({ className }: YegoHeaderProps) {
  return (
    <header className={cn('yego-header', className)}>
      <img className="logo" src="/logo.png" alt="Yego" />
      <Hamburger className="hamburger" />
      <nav>
        <a href="/" className="active">
          Map
        </a>
        <a href="/settings">Settings</a>
      </nav>
    </header>
  );
}

function Hamburger({ className }: { className: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <button
      className={cn(className, isMenuOpen ? 'open' : '')}
      onClick={toggleMenu}
      aria-label="Toggle menu"
    >
      <svg viewBox="0 0 24 24" width="24" height="24">
        <line x1="0" y1="5" x2="24" y2="5" />
        <line x1="0" y1="12" x2="24" y2="12" />
        <line x1="0" y1="19" x2="24" y2="19" />
      </svg>
    </button>
  );

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }
}
