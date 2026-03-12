"use client";

import { MapPin, Globe } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

export function Localizacao() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start gap-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
            className="flex-1"
          >
            <p className="text-accent text-[13px] font-semibold tracking-[0.2em] uppercase mb-5">
              Localizacao
            </p>
            <h2 className="text-3xl md:text-[2.75rem] font-bold text-primary font-display tracking-[-0.025em] leading-[1.1] mb-6">
              Cascais, Portugal
            </h2>
            <p className="text-muted text-lg leading-[1.7] mb-4 tracking-[-0.006em]">
              Estamos sediados em Cascais, Portugal, com base na regiao da Panfilheira.
            </p>
            <p className="text-muted text-lg leading-[1.7] mb-10 tracking-[-0.006em]">
              A partir daqui estruturamos novos negocios e parcerias para Portugal,
              Europa e conexoes com o Brasil.
            </p>

            {/* Info card */}
            <div className="bg-[#f8f9fb] rounded-2xl border border-black/[0.04] p-6 hover:shadow-xl hover:shadow-black/[0.03] transition-all duration-500">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/[0.05] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1 tracking-[-0.01em]">Sede</p>
                  <p className="text-muted text-[14px] leading-relaxed">
                    Estoril, Cascais
                    <br />
                    Portugal
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-black/[0.04]">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-3.5 h-3.5 text-muted/50" />
                  <p className="text-[11px] text-muted/60 uppercase tracking-[0.15em] font-semibold">
                    Mercados
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Portugal", "Europa", "Brasil"].map((m) => (
                    <span
                      key={m}
                      className="text-[12px] font-medium text-primary bg-primary/[0.05] px-3.5 py-1.5 rounded-full"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 0.15, duration: 0.8, ease }}
            className="w-full md:w-[480px]"
          >
            <div className="rounded-2xl overflow-hidden border border-black/[0.04] shadow-xl shadow-black/[0.04] h-[420px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12445.85!2d-9.42!3d38.69!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1ec9e1a3c73e53%3A0x2345678!2sCascais%2C+Portugal!5e0!3m2!1spt-PT!2spt!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localizacao do Grupo +351 em Cascais, Portugal"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
