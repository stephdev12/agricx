"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface AnimatedMarqueeHeroProps {
  tagline: React.ReactNode;
  title: React.ReactNode;
  description: string;
  ctaText: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  images: string[];
  className?: string;
}

export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  tagline,
  title,
  description,
  ctaText,
  ctaLink = "/auth",
  secondaryCtaText,
  secondaryCtaLink,
  images,
  className,
}) => {
  const FADE_IN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
  };

  const duplicatedImages = [...images, ...images];

  return (
    <section
      className={cn(
        "relative w-full min-h-[85vh] overflow-hidden bg-transparent flex flex-col items-center justify-center text-center px-4 pt-28 pb-16 text-foreground",
        className
      )}
    >
      <div className="z-10 flex flex-col items-center max-w-3xl mx-auto">
        {/* Tagline */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          className="mb-4"
        >
          {typeof tagline === "string" ? (
            <div className="inline-block rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-foreground">
              {tagline}
            </div>
          ) : (
            tagline
          )}
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]"
        >
          {typeof title === "string" ? (
            title.split(" ").map((word, i) => (
              <motion.span
                key={i}
                variants={FADE_IN_ANIMATION_VARIANTS}
                className="inline-block"
              >
                {word}&nbsp;
              </motion.span>
            ))
          ) : (
            title
          )}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.3 }}
          className="mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed font-normal"
        >
          {description}
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-6"
        >
          <Link href={ctaLink}>
            <Button variant="emerald" size="lg" className="gap-2 shadow-md">
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          {secondaryCtaText && secondaryCtaLink && (
            <Link href={secondaryCtaLink}>
              <Button variant="outline" size="lg">
                {secondaryCtaText}
              </Button>
            </Link>
          )}
        </motion.div>
      </div>

      {/* Animated Image Marquee with tilted photo tiles */}
      <div className="w-full mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <motion.div
          className="flex gap-4 w-max"
          animate={{
            x: ["0%", "-50%"],
            transition: {
              ease: "linear",
              duration: 35,
              repeat: Infinity,
            },
          }}
        >
          {duplicatedImages.map((src, index) => (
            <div
              key={index}
              className="relative aspect-[4/3] h-40 sm:h-52 shrink-0 rounded-2xl overflow-hidden border border-border/80 shadow-sm bg-card"
              style={{
                transform: `rotate(${index % 2 === 0 ? -2 : 3}deg)`,
              }}
            >
              <img
                src={src}
                alt={`Agricx culture showcase ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedMarqueeHero;
