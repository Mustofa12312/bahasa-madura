import React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 3, ...props }, ref) => {
    const textareaId = id || props.name || Math.random().toString(36).substring(2, 9);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-semibold text-navy-800 tracking-wide uppercase">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            'w-full rounded-xl border border-madura-border bg-white px-4 py-2.5 text-sm text-navy placeholder:text-madura-muted/70 transition-all focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10 disabled:cursor-not-allowed disabled:bg-stone-50',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-100',
            className
          )}
          {...props}
        />
        {helperText && !error && (
          <p className="text-xs text-madura-muted">{helperText}</p>
        )}
        {error && (
          <p className="text-xs font-medium text-rose-600">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

