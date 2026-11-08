import React from 'react';

export const WordCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-madura-border bg-white p-5 shadow-subtle animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 bg-stone-200 rounded-md"></div>
        <div className="h-5 w-20 bg-stone-100 rounded-full"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-stone-100 rounded"></div>
        <div className="h-4 w-3/4 bg-stone-100 rounded"></div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-stone-100">
        <div className="h-4 w-24 bg-stone-100 rounded"></div>
        <div className="h-8 w-8 bg-stone-100 rounded-lg"></div>
      </div>
    </div>
  );
};

export const DictionaryGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <WordCardSkeleton key={i} />
      ))}
    </div>
  );
};

