"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { TypeWriter } from "./TypeWriter";
import { MagneticButton } from "./MagneticButton";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 80]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.96]);

  return (
    <section
      ref={ref}
      className="min-h-[100svh] flex items-center justify-center relative pt-16 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8f9fb] via-white to-white" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(#1e3a5f 1px, transparent 1px), linear-gradient(90deg, #1e3a5f 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Ambient orbs */}
      <motion.div
        className="absolute top-[15%] -left-40 w-[600px] h-[600px] rounded-full bg-accent/[0.03] blur-[120px]"
        animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[20%] -right-40 w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[120px]"
        animate={{ y: [0, -40, 0], x: [0, -20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-accent/[0.015] to-primary/[0.01] blur-[140px]"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        style={{ opacity, y, scale }}
        className="relative max-w-5xl mx-auto px-6 text-center py-24"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.1, duration: 0.7, ease }}
          className="inline-flex items-center gap-2.5 bg-white/70 backdrop-blur-xl border border-black/[0.04] rounded-full px-5 py-2 mb-10 shadow-sm shadow-black/[0.03]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-muted text-[13px] font-medium tracking-wide">
            Cascais, Portugal
          </span>
        </motion.div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-primary tracking-[-0.035em] mb-3 font-display leading-[0.95]">
          <motion.span
            initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.2, duration: 0.8, ease }}
            className="inline-block"
          >
            GRUPO
          </motion.span>{" "}
          <motion.span
            initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.3, duration: 0.8, ease }}
            className="inline-block"
          >
            <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">+</span>351
          </motion.span>
        </h1>

        {/* Typewriter subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="min-h-[2rem] md:min-h-[2.5rem] mt-5 mb-10"
        >
          <TypeWriter
            words={[
              "Venture Builder luso-brasileiro",
              "Onde fisico e digital se encontram",
              "Estrutura que aprende. Ativos que duram.",
              "Construido para operar. Desenhado para escalar.",
            ]}
            className="text-xl md:text-2xl text-muted font-light tracking-[-0.01em]"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease }}
          className="text-lg md:text-xl text-foreground/90 leading-[1.65] max-w-2xl mx-auto mb-5 tracking-[-0.01em]"
        >
          Construimos, operamos e escalamos empresas reais com fundamento
          economico, governanca solida e visao de longo prazo.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease }}
          className="text-base text-muted leading-[1.7] max-w-2xl mx-auto mb-14 tracking-[-0.006em]"
        >
          Somos um venture builder sediado em Cascais, Portugal. Integramos
          operacoes fisicas, plataformas digitais e tecnologia proprietaria
          para criar, operar e escalar negocios reais entre Europa, America Latina e Asia.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton>
            <a
              href="/aplicar"
              className="group inline-flex items-center gap-2.5 bg-primary text-white px-8 py-4 rounded-2xl text-[15px] font-semibold hover:bg-primary-light transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 active:scale-[0.97]"
            >
              Candidatar-se a uma JV
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
            </a>
          </MagneticButton>
          <MagneticButton strength={0.2}>
            <a
              href="/ecossistema"
              className="group inline-flex items-center gap-2 text-muted hover:text-primary px-6 py-4 text-[15px] font-medium transition-all duration-300 border border-transparent hover:border-black/[0.06] rounded-2xl hover:bg-white/60 hover:backdrop-blur-xl"
            >
              Ver ecossistema
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
            </a>
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-7 h-11 rounded-full border-[1.5px] border-black/[0.08] flex justify-center pt-2.5"
        >
          <motion.div
            className="w-[3px] h-[6px] rounded-full bg-black/[0.15]"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
