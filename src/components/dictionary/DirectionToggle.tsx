import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { SearchDirection } from '../../types';

export interface DirectionToggleProps {
  direction: SearchDirection;
  onChange: (direction: SearchDirection) => void;
}

export const DirectionToggle: React.FC<DirectionToggleProps> = ({ direction, onChange }) => {
  const isM2I = direction === 'm2i';

  return (
    <div className="inline-flex items-center rounded-2xl bg-white p-1 border border-madura-border shadow-subtle">
      <button
        type="button"
        onClick={() => onChange('m2i')}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
          isM2I
            ? 'bg-navy text-ivory shadow-sm'
            : 'text-madura-muted hover:text-navy hover:bg-ivory-warm'
        }`}
      >
        <span className="font-bold">Madura</span>
        <span className="text-gold-400">→</span>
        <span>Indonesia</span>
      </button>

      <button
        type="button"
        onClick={() => onChange(isM2I ? 'i2m' : 'm2i')}
        title="Tukar arah pencarian"
        className="mx-0.5 p-1.5 rounded-lg text-madura-muted hover:text-navy hover:bg-ivory-warm transition-colors"
      >
        <ArrowLeftRight className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => onChange('i2m')}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
          !isM2I
            ? 'bg-navy text-ivory shadow-sm'
            : 'text-madura-muted hover:text-navy hover:bg-ivory-warm'
        }`}
      >
        <span>Indonesia</span>
        <span className="text-gold-400">→</span>
        <span className="font-bold">Madura</span>
      </button>
    </div>
  );
};

