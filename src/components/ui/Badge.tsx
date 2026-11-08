import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'gold' | 'forest' | 'navy' | 'outline' | 'amber' | 'emerald';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-stone-100 text-stone-700 border-stone-200',
    gold: 'bg-gold-50 text-gold-600 border-gold/40 font-medium',
    forest: 'bg-emerald-50 text-forest border-emerald-200',
    navy: 'bg-navy-50 text-navy-800 border-navy-200',
    outline: 'bg-transparent border border-madura-border text-madura-muted',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs tracking-wide',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

