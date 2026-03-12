"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Props {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export function TextReveal({ text, className = "", delay = 0, as: Tag = "span" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const words = text.split(" ");

  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.5,
              delay: delay + i * 0.04,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </Tag>
  );
}
