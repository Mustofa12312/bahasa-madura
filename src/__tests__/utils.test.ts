import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatRelativeTime } from '../lib/utils';

describe('Utility Functions', () => {
  describe('cn (Tailwind Class Merging)', () => {
    it('should merge classes properly and eliminate conflicts', () => {
      const result = cn('px-4 py-2', 'px-6', { 'text-red-500': true, 'bg-blue-500': false });
      expect(result).toContain('px-6');
      expect(result).not.toContain('px-4');
      expect(result).toContain('text-red-500');
      expect(result).not.toContain('bg-blue-500');
    });
  });

  describe('formatDate', () => {
    it('should format ISO timestamp to Indonesian locale date string', () => {
      const formatted = formatDate('2026-05-15T10:00:00Z');
      expect(formatted).toContain('Mei');
      expect(formatted).toContain('2026');
    });
  });

  describe('formatRelativeTime', () => {
    it('should return relative time description', () => {
      const now = Date.now();
      const fiveMinAgo = new Date(now - 5 * 60 * 1000).toISOString();
      const rel = formatRelativeTime(fiveMinAgo);
      expect(rel).toContain('lalu');
    });
  });
});

