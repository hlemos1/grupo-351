"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  stagger?: number;
}

const container = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: {
      staggerChildren: stagger,
    },
  }),
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function StaggerChildren({ children, className = "", stagger = 0.08 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={stagger}
      className={className}
    >
      {children}
    </motion.div>
  );
}
