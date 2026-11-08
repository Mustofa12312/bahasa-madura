import React from 'react';
import { SearchX } from 'lucide-react';
import { Button } from '../ui/Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto my-6 rounded-2xl bg-white/70 border border-madura-border/60 shadow-subtle">
      <div className="w-14 h-14 rounded-2xl bg-ivory-warm border border-madura-border flex items-center justify-center text-gold-500 mb-4 shadow-sm">
        {icon || <SearchX className="w-7 h-7 text-gold-500" />}
      </div>
      <h3 className="text-lg font-bold text-navy mb-1.5">{title}</h3>
      <p className="text-sm text-madura-muted mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

