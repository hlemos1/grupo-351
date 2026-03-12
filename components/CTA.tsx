"use client";

import { ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MagneticButton } from "./MagneticButton";

const ease = [0.16, 1, 0.3, 1] as const;

export function CTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#0f2d4a] to-primary-dark" />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-accent/[0.05] blur-[160px] rounded-full"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
        >
          <h2 className="text-3xl md:text-[2.75rem] font-bold text-white font-display tracking-[-0.025em] leading-[1.1] mb-5">
            Tem uma oportunidade em mente?
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-2xl mx-auto leading-[1.7] tracking-[-0.006em]">
            Estamos sempre abertos a conhecer operadores, empreendedores e
            especialistas que queiram construir algo relevante em Portugal.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton>
              <a
                href="/aplicar"
                className="group inline-flex items-center gap-2.5 bg-white text-primary px-8 py-4 rounded-2xl text-[15px] font-semibold hover:bg-white/95 transition-all duration-500 shadow-lg shadow-black/[0.08] hover:shadow-2xl hover:shadow-white/[0.08] active:scale-[0.97]"
              >
                Candidatar-se a uma JV
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </MagneticButton>
            <a
              href="/parceiros"
              className="group inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-[14px] font-medium transition-colors duration-300"
            >
              Ver modelos de parceria
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
