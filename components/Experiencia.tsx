"use client";

import { Building2, Users, Target, Handshake } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";
import { TextReveal } from "./TextReveal";
import { StaggerChildren, staggerItem } from "./StaggerChildren";
import { SpotlightCard } from "./SpotlightCard";
import { ParallaxSection } from "./ParallaxSection";

const items = [
  { icon: Building2, label: "Criação de empresas", desc: "Do zero ao operacional" },
  { icon: Users, label: "Gestão de equipes", desc: "Liderança multifuncional" },
  { icon: Target, label: "Estratégia de mercado", desc: "Posicionamento certeiro" },
  { icon: Handshake, label: "Parcerias estratégicas", desc: "Alianças de valor" },
];

export function Experiencia() {
  return (
    <section className="py-24 bg-surface overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <p className="text-accent text-sm font-medium tracking-[0.15em] uppercase mb-4">
              Nossa Experiência
            </p>
            <TextReveal
              text="Construção real de negócios"
              as="h2"
              className="text-3xl md:text-4xl font-bold text-primary font-display mb-8"
            />
            <p className="text-muted text-lg leading-relaxed mb-4">
              Ao longo de suas trajetórias no Brasil, os fundadores participaram da
              criação e desenvolvimento de diferentes negócios em setores diversos.
            </p>
            <p className="text-muted text-lg leading-relaxed mb-4">
              Essa experiência prática em construção de empresas é a base do Grupo +351.
            </p>
            <p className="text-foreground text-lg leading-relaxed font-medium">
              Mais do que teoria ou consultoria, trabalhamos com execução, estrutura e
              parceria.
            </p>
          </AnimatedSection>

          <ParallaxSection offset={30}>
            <StaggerChildren className="grid grid-cols-2 gap-4">
              {items.map(({ icon: Icon, label, desc }) => (
                <motion.div key={label} variants={staggerItem}>
                  <SpotlightCard className="group bg-white p-6 rounded-2xl border border-border hover:border-accent/20 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center group-hover:from-primary/10 group-hover:to-accent/10 transition-all mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="text-xs text-muted mt-1">{desc}</p>
                  </SpotlightCard>
                </motion.div>
              ))}
            </StaggerChildren>
          </ParallaxSection>
        </div>
      </div>
    </section>
  );
}
