import React, { useRef, useEffect } from 'react';
import { Search, X, Command } from 'lucide-react';
import { SearchDirection } from '../../types';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  direction: SearchDirection;
  onClear?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  direction,
  onClear,
  placeholder,
  autoFocus = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        // Prevent default slash insertion
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const defaultPlaceholder = direction === 'm2i'
    ? 'Cari kosakata Madura (contoh: abâ\', sèhat, ajhâlân)...'
    : 'Cari kata Indonesia (contoh: kamu, makan, berjalan)...';

  return (
    <div className="relative w-full group">
      <div className="relative flex items-center w-full">
        <div className="absolute left-4.5 text-navy-400 pointer-events-none group-focus-within:text-gold-500 transition-colors">
          <Search className="w-5 h-5 ml-1" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || defaultPlaceholder}
          autoFocus={autoFocus}
          className="w-full pl-13 pr-24 py-4 rounded-2xl bg-white border border-madura-border text-navy text-base shadow-subtle placeholder:text-madura-muted/60 transition-all duration-200 focus:outline-none focus:border-navy focus:ring-4 focus:ring-navy/5 group-hover:border-navy/40"
        />

        <div className="absolute right-4 flex items-center gap-1.5">
          {value ? (
            <button
              type="button"
              onClick={() => {
                onChange('');
                onClear?.();
                inputRef.current?.focus();
              }}
              title="Hapus pencarian"
              className="p-1.5 rounded-lg text-madura-muted hover:text-navy hover:bg-ivory-warm transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-stone-100 border border-stone-200 text-stone-500 text-xs font-mono font-medium select-none pointer-events-none">
              <span className="text-[10px]">Tekan</span>
              <kbd className="font-semibold text-navy">/</kbd>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

