"use client";

import { ArrowRight, Repeat2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface CardFlipProps {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
  icon?: React.ReactNode;
  badge?: string;
}

export function CardFlip({
  title = "Pisciculture Intensive",
  subtitle = "Silures Clarias & Tilapias",
  description = "Élevage en bacs hors-sol ou étangs avec calcul des rations alimentaires et calendrier de vente.",
  features = ["Rentabilité dès 4 mois", "Bacs hors-sol ou étangs", "Marché local à forte demande", "Alimentation locale possible"],
  icon,
}: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group relative h-[320px] w-full max-w-[280px] [perspective:2000px] cursor-pointer mx-auto"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          "relative h-full w-full",
          "[transform-style:preserve-3d]",
          "transition-[transform] duration-500 ease-[cubic-bezier(0.77,0,0.175,1)]",
          "motion-reduce:transition-none",
          isFlipped
            ? "[transform:rotateY(180deg)]"
            : "[transform:rotateY(0deg)]"
        )}
      >
        {/* Front of card */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full",
            "[backface-visibility:hidden] [transform:rotateY(0deg)]",
            "overflow-hidden rounded-2xl",
            "bg-card",
            "border border-border",
            "shadow-xs",
            "transition-shadow duration-500",
            "group-hover:shadow-md"
          )}
        >
          <div className="relative h-full overflow-hidden bg-gradient-to-b from-emerald-500/10 via-card to-card">
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-start justify-center pt-16"
            >
              <div className="relative flex h-[100px] w-[100px] items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {icon || <div className="text-3xl">🌱</div>}
              </div>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 left-0 p-5 bg-card border-t border-border">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <h3 className="font-bold text-base text-foreground leading-snug tracking-tight">
                  {title}
                </h3>
                <p className="line-clamp-1 text-xs text-muted-foreground tracking-tight">
                  {subtitle}
                </p>
              </div>
              <div className="group/icon relative shrink-0">
                <Repeat2
                  aria-hidden="true"
                  className="relative z-10 h-4 w-4 text-emerald-600 dark:text-emerald-400 transition-transform duration-300 group-hover/icon:-rotate-12 group-hover/icon:scale-110"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full",
            "[backface-visibility:hidden] [transform:rotateY(180deg)]",
            "rounded-2xl p-5",
            "bg-neutral-900 dark:bg-neutral-950 text-white",
            "border border-neutral-800",
            "shadow-md",
            "flex flex-col justify-between"
          )}
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-white tracking-tight">
                {title}
              </h3>
              <p className="text-xs text-neutral-300 line-clamp-3 leading-relaxed">
                {description}
              </p>
            </div>

            <div className="space-y-2 pt-1 border-t border-neutral-800">
              {features.map((feature, index) => (
                <div
                  className="flex items-center gap-2 text-xs text-neutral-200"
                  key={feature}
                  style={{
                    transform: isFlipped ? "translateX(0)" : "translateX(-10px)",
                    opacity: isFlipped ? 1 : 0,
                    transition: "all 0.3s ease",
                    transitionDelay: `${index * 40 + 100}ms`,
                  }}
                >
                  <ArrowRight
                    aria-hidden="true"
                    className="h-3 w-3 text-emerald-400 shrink-0"
                  />
                  <span className="truncate">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-medium group-hover:text-emerald-300">
              <span>Voir le modèle complet</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardFlip;
