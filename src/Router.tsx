import * as React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { App as Dashboard } from './sidepanel/App';
import { App as QuickAdd } from './popup/App';
import { App as Settings } from './options/App';
import { App as Overview } from './newtab/App';

const NavBar: React.FC = () => {
  const link = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded-xl text-sm transition-colors ${
      isActive
        ? 'bg-[var(--color-brand-soft)] text-[var(--color-brand)]'
        : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
    }`;
  return (
    <nav className="sticky top-0 z-10 flex items-center gap-1 px-4 py-2 border-b border-[var(--color-line)] bg-[var(--color-bg)]/90 backdrop-blur">
      <span className="font-display text-base font-semibold mr-2">feasty</span>
      <NavLink to="/" end className={link}>dashboard</NavLink>
      <NavLink to="/overview" className={link}>overview</NavLink>
      <NavLink to="/quick-add" className={link}>quick add</NavLink>
      <NavLink to="/settings" className={link}>settings</NavLink>
    </nav>
  );
};

export const Router: React.FC = () => (
  <div className="min-h-screen flex flex-col">
    <NavBar />
    <div className="flex-1">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/quick-add" element={<QuickAdd />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  </div>
);
