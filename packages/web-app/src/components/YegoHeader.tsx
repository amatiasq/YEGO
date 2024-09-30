import { cn } from '../util/cn';
import './YegoHeader.css';

export interface YegoHeaderProps {
  className?: string;
}

export function YegoHeader({ className }: YegoHeaderProps) {
  return (
    <header className={cn('yego-header', className)}>
      <img className="logo" src="/logo.png" alt="Yego" />
      <nav>
        <a href="/" className="active">
          Map
        </a>
        <a href="/settings">Settings</a>
      </nav>
    </header>
  );
}
