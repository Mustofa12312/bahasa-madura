import React from 'react';
import { SpeechLevel } from '../../types';
import { getSpeechLevelMeta } from '../../lib/utils';
import { ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';

export interface SpeechLevelBadgeProps {
  level: SpeechLevel;
  showIcon?: boolean;
  className?: string;
}

export const SpeechLevelBadge: React.FC<SpeechLevelBadgeProps> = ({
  level,
  showIcon = true,
  className = ''
}) => {
  const meta = getSpeechLevelMeta(level);

  const getIcon = () => {
    switch (level) {
      case 'engghi_bhunten':
        return <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />;
      case 'engghi_enten':
        return <Sparkles className="w-3.5 h-3.5 text-emerald-600" />;
      case 'enja_iya':
        return <MessageCircle className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <span
      title={`${meta.name} — ${meta.description}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shadow-xs transition-colors cursor-help ${meta.badgeClass} ${className}`}
    >
      {showIcon && getIcon()}
      <span>{meta.badgeLabel}</span>
    </span>
  );
};
