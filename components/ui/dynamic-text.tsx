"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface Greeting {
  text: string;
  language: string;
}

const greetings: Greeting[] = [
  { text: "Bonjour", language: "Français" },
  { text: "Welcome", language: "English" },
  { text: "Mbolo", language: "Ewondo / Fang" },
  { text: "Mbote", language: "Lingala" },
  { text: "Jam waali", language: "Fulfulde" },
  { text: "How far", language: "Cameroon Pidgin" },
  { text: "Oteke", language: "Bassa" },
  { text: "Agricx 237", language: "Cameroun" },
];

export function DynamicText() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= greetings.length) {
          clearInterval(interval);
          setIsAnimating(false);
          return prevIndex;
        }
        return nextIndex;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const textVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -15, opacity: 0 },
  };

  return (
    <div
      aria-label="Salutations camerounaises multilingues"
      className="inline-flex items-center gap-2 py-1 px-3.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold"
    >
      <div className="relative flex h-5 min-w-[110px] items-center justify-start overflow-visible">
        {isAnimating ? (
          <AnimatePresence mode="popLayout">
            <motion.div
              animate={textVariants.visible}
              aria-live="off"
              className="absolute flex items-center gap-1.5 font-semibold text-xs text-emerald-700 dark:text-emerald-300"
              exit={textVariants.exit}
              initial={textVariants.hidden}
              key={currentIndex}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{greetings[currentIndex].text}</span>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex items-center gap-1.5 font-semibold text-xs text-emerald-700 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Agricx Cameroun 🇨🇲</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default DynamicText;
