"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const phone = "351000000000";
  const message = encodeURIComponent(
    "Olá! Gostaria de saber mais sobre as oportunidades do Grupo +351."
  );

  return (
    <motion.a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-13 h-13 bg-[#25d366] rounded-full flex items-center justify-center shadow-lg shadow-[#25d366]/20 hover:shadow-xl hover:shadow-[#25d366]/30 hover:scale-105 active:scale-95 transition-all duration-300"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      aria-label="Fale conosco no WhatsApp"
    >
      <MessageCircle className="w-6 h-6 text-white" />
    </motion.a>
  );
}
