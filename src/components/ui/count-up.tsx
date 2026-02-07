'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
  formatFn?: (value: number) => string;
}

export function CountUp({
  from = 0,
  to,
  duration = 600,
  className,
  formatFn = (v) => Math.round(v).toString(),
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(to);
  const prevToRef = useRef(to);
  const initialRef = useRef(true);

  useEffect(() => {
    // Skip animation on initial mount
    if (initialRef.current) {
      initialRef.current = false;
      prevToRef.current = to;
      return;
    }

    const startValue = prevToRef.current;
    prevToRef.current = to;

    if (startValue === to) return;

    const startTime = performance.now();

    function easeOutCubic(t: number): number {
      return 1 - Math.pow(1 - t, 3);
    }

    let rafId: number;
    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = startValue + (to - startValue) * eased;
      setDisplayValue(current);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [to, duration]);

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {formatFn(displayValue)}
    </span>
  );
}
