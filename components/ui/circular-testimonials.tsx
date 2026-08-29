"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
}

export interface FontSizes {
  name?: string;
  designation?: string;
  quote?: string;
}

export interface CircularTestimonialsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  fontSizes?: FontSizes;
}

function calculateGap(width: number) {
  const minWidth = 768;
  const maxWidth = 1200;
  const minGap = 40;
  const maxGap = 70;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth)
    return Math.max(minGap, maxGap + 0.05 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export const CircularTestimonials = ({
  testimonials,
  autoplay = true,
  fontSizes = {},
}: CircularTestimonialsProps) => {
  const fontSizeName = fontSizes.name ?? "1.35rem";
  const fontSizeDesignation = fontSizes.designation ?? "0.875rem";
  const fontSizeQuote = fontSizes.quote ?? "1.05rem";

  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(800);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const testimonialsLength = useMemo(() => testimonials.length, [testimonials]);
  const activeTestimonial = useMemo(
    () => testimonials[activeIndex],
    [activeIndex, testimonials]
  );

  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (autoplay) {
      autoplayIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonialsLength);
      }, 6000);
    }
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [autoplay, testimonialsLength]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonialsLength) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);

  function getImageStyle(index: number): React.CSSProperties {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.7;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + testimonialsLength) % testimonialsLength === index;
    const isRight = (activeIndex + 1) % testimonialsLength === index;

    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(0px) translateY(0px) scale(1) rotateY(0deg)`,
        transition: "all 0.7s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 0.9,
        pointerEvents: "auto",
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(12deg)`,
        transition: "all 0.7s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 0.9,
        pointerEvents: "auto",
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-12deg)`,
        transition: "all 0.7s cubic-bezier(.4,2,.3,1)",
      };
    }
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.7s cubic-bezier(.4,2,.3,1)",
    };
  }

  const quoteVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 text-foreground">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Images with 3D perspective stack */}
        <div className="md:col-span-5 relative w-full h-72 sm:h-80 [perspective:1000px]" ref={imageContainerRef}>
          {testimonials.map((testimonial, index) => (
            <img
              key={testimonial.src}
              src={testimonial.src}
              alt={testimonial.name}
              className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-lg border border-border"
              style={getImageStyle(index)}
            />
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={quoteVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-3"
            >
              <div>
                <h3
                  className="font-bold tracking-tight text-foreground"
                  style={{ fontSize: fontSizeName }}
                >
                  {activeTestimonial.name}
                </h3>
                <p
                  className="font-medium mt-0.5 text-emerald-600 dark:text-emerald-400"
                  style={{ fontSize: fontSizeDesignation }}
                >
                  {activeTestimonial.designation}
                </p>
              </div>

              <motion.p
                className="leading-relaxed text-muted-foreground"
                style={{ fontSize: fontSizeQuote }}
              >
                {activeTestimonial.quote.split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ filter: "blur(8px)", opacity: 0, y: 4 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      delay: 0.02 * i,
                    }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handlePrev}
              aria-label="Témoignage précédent"
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shadow-xs hover:scale-105 bg-muted text-foreground hover:bg-emerald-600 hover:text-white border border-border"
            >
              <FaArrowLeft size={14} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Témoignage suivant"
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shadow-xs hover:scale-105 bg-muted text-foreground hover:bg-emerald-600 hover:text-white border border-border"
            >
              <FaArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularTestimonials;
