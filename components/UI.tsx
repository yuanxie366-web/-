
import React from 'react';
import { TreeState } from '../types';

interface UIProps {
  state: TreeState;
  onToggle: () => void;
}

const UI: React.FC<UIProps> = ({ state, onToggle }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12">
      <header className="flex flex-col gap-1 items-start">
        <h1 className="text-4xl md:text-6xl font-serif text-[#ffd700] drop-shadow-lg tracking-tight">
          GRAND LUXURY
        </h1>
        <div className="h-1 w-24 bg-[#ffd700]" />
        <p className="text-[#00c853] font-medium tracking-widest text-xs mt-2 uppercase">
          Interactive Christmas Experience
        </p>
      </header>

      <div className="flex flex-col items-center gap-6 mb-12">
        <button
          onClick={onToggle}
          className="pointer-events-auto px-10 py-4 bg-transparent border-2 border-[#ffd700] text-[#ffd700] text-lg font-serif uppercase tracking-widest transition-all duration-500 hover:bg-[#ffd700] hover:text-[#010a01] hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,215,0,0.3)] group overflow-hidden relative"
        >
          <span className="relative z-10">
            {state === TreeState.CHAOS ? 'Form the Tree' : 'Release Chaos'}
          </span>
          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </button>
        
        <div className="text-[#ffd700]/60 text-[10px] tracking-[0.3em] uppercase flex items-center gap-4">
          <span className="w-12 h-[1px] bg-[#ffd700]/30" />
          Interactive 3D Art
          <span className="w-12 h-[1px] bg-[#ffd700]/30" />
        </div>
      </div>

      <footer className="flex justify-between items-end text-[#ffd700]/40 text-[10px] tracking-widest uppercase">
        <div>© 2024 MAR-A-LAGO STUDIOS</div>
        <div className="flex gap-4">
          <span>Move Mouse to Interact</span>
          <span className="text-[#ffd700]">High Fidelity</span>
        </div>
      </footer>
    </div>
  );
};

export default UI;
