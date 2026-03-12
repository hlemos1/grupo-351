"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Props {
  value: number;
  suffix?: string;
  label?: string;
  className?: string;
}

export function Counter({ value, suffix = "", label, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = Math.max(1, Math.floor(value / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <div ref={ref} className={className}>
      <span>
        {count}
        {suffix}
      </span>
      {label && <p className="text-muted text-sm mt-2">{label}</p>}
    </div>
  );
}
