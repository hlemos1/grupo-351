"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 10, suffix: "+", label: "Anos de experiência combinada" },
  { value: 200, suffix: "+", label: "Unidades criadas no Brasil" },
  { value: 3, suffix: "", label: "Países de atuação" },
  { value: 20, suffix: "+", label: "Marcas desenvolvidas" },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const duration = 1200;
    const steps = 60;
    const increment = value / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 4);
      current = Math.round(eased * value);
      if (step >= steps) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

const ease = [0.16, 1, 0.3, 1] as const;

export function Numeros() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-24 md:py-28 bg-primary overflow-hidden">
      {/* Ambient gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[#0f2d4a]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      <motion.div
        className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-accent/[0.06] blur-[120px] rounded-full"
        animate={{ x: [0, 60, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.7, ease }}
              className={`text-center ${
                i < stats.length - 1 ? "md:border-r md:border-white/[0.06]" : ""
              }`}
            >
              <p className="text-5xl md:text-6xl font-bold text-white font-display tracking-[-0.03em]">
                <AnimatedNumber value={s.value} suffix={s.suffix} />
              </p>
              <p className="text-white/40 text-[13px] mt-3 tracking-wide font-medium uppercase">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
