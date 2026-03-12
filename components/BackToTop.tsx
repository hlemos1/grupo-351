"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-6 z-50 w-10 h-10 bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-full flex items-center justify-center shadow-lg shadow-black/[0.06] hover:shadow-xl hover:bg-white active:scale-90 transition-all duration-300"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="w-4 h-4 text-foreground" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
