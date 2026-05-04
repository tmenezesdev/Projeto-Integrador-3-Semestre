'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ThemeContext/themecontext';

export default function ThemeToggle({ collapsed, trackOn, trackOff = '#334155' }) {
  const { isDark, toggle } = useTheme();

  if (collapsed) {
    return (
      <div className="flex justify-center w-full group relative">
        <button
          onClick={toggle}
          aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
          className="p-2.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
        >
          {isDark
            ? <Moon size={17} />
            : <Sun  size={17} style={{ color: trackOn }} />
          }
        </button>
        <div
          className="absolute left-full ml-3 px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border"
          style={{
            background:   isDark ? '#1e1b3a' : '#ffffff',
            borderColor:  `${trackOn}44`,
            color:        isDark ? '#e2e8f0' : '#1e1b3a',
            boxShadow:    isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.12)',
          }}
        >
          {isDark ? 'Modo Escuro' : 'Modo Claro'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full">

      {/* Ícone — decorativo */}
      <div className="flex-shrink-0 w-[18px] flex items-center justify-center pointer-events-none">
        {isDark
          ? <Moon size={15} className="text-slate-500" />
          : <Sun  size={15} style={{ color: trackOn }} />
        }
      </div>

      {/* Track — único elemento clicável */}
      <button
        onClick={toggle}
        aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
        className="relative flex-shrink-0 w-10 h-[22px] rounded-full cursor-pointer focus:outline-none"
        style={{
          background: isDark ? trackOff : trackOn,
          transition: 'background-color 0.55s ease-in-out, box-shadow 0.55s ease-in-out',
          boxShadow: isDark ? 'none' : `0 0 10px ${trackOn}66`,
        }}
      >
        <div
          className="absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-md"
          style={{
            left: 3,
            transform: isDark ? 'translateX(0px)' : 'translateX(18px)',
            transition: 'transform 0.55s ease-in-out',
          }}
        />
      </button>

      {/* Label — decorativo */}
      <span
        className="text-sm font-medium pointer-events-none whitespace-nowrap"
        style={{ color: isDark ? '#64748b' : '#1e1b3a' }}
      >
        {isDark ? 'Modo Escuro' : 'Modo Claro'}
      </span>
    </div>
  );
}
