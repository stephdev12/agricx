"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AITextLoadingProps {
  texts?: string[];
  className?: string;
  interval?: number;
}

export function AITextLoading({
  texts = [
    "Analyse des symptômes...",
    "Calcul des rations nutritionnelles...",
    "Vérification des protocoles vétérinaires...",
    "Recherche des intrants locaux...",
    "Finalisation de la prescription...",
  ],
  className,
  interval = 1800,
}: AITextLoadingProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, texts.length]);

  return (
    <div className="flex items-center justify-center p-4">
      <motion.div
        animate={{ opacity: 1 }}
        className="relative w-full px-4 py-2"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            animate={{
              opacity: 1,
              y: 0,
              backgroundPosition: ["200% center", "-200% center"],
            }}
            className={cn(
              "flex min-w-max justify-center whitespace-nowrap bg-[length:200%_100%] bg-gradient-to-r from-emerald-700 via-emerald-400 to-emerald-700 dark:from-emerald-400 dark:via-emerald-100 dark:to-emerald-400 bg-clip-text font-bold text-xl sm:text-2xl text-transparent",
              className
            )}
            exit={{ opacity: 0, y: -16 }}
            initial={{ opacity: 0, y: 16 }}
            key={currentTextIndex}
            transition={{
              opacity: { duration: 0.25 },
              y: { duration: 0.25 },
              backgroundPosition: {
                duration: 2.5,
                ease: "linear",
                repeat: Number.POSITIVE_INFINITY,
              },
            }}
          >
            {texts[currentTextIndex]}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default AITextLoading;
