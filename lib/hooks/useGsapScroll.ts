'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function useGsapScroll() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Éléments avec la classe .gsap-reveal (animation fluide haut/bas)
      const elements = containerRef.current?.querySelectorAll('.gsap-reveal');
      elements?.forEach((el) => {
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              end: 'bottom 15%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });

      // Éléments avec effet parallax léger (.gsap-parallax)
      const parallaxEls = containerRef.current?.querySelectorAll('.gsap-parallax');
      parallaxEls?.forEach((el) => {
        gsap.to(el, {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: 0 },
        ease: 'power3.inOut',
      });
    }
  };

  const scrollToBottom = () => {
    if (typeof window !== 'undefined') {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: document.body.scrollHeight },
        ease: 'power3.inOut',
      });
    }
  };

  return { containerRef, scrollToTop, scrollToBottom };
}
