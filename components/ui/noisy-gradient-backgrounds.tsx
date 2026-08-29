'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

interface NoiseProps {
  patternSize?: number;
  patternScaleX?: number;
  patternScaleY?: number;
  patternRefreshInterval?: number;
  patternAlpha?: number;
  intensity?: number;
}

// Noise component integrated into the background
function Noise({
  patternSize = 100,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 2,
  patternAlpha = 25,
  intensity = 0.8,
}: NoiseProps) {
  const grainRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCssSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = patternSize;
    patternCanvas.height = patternSize;

    const patternCtx = patternCanvas.getContext('2d');
    if (!patternCtx) return;

    const patternData = patternCtx.createImageData(patternSize, patternSize);
    const patternPixelDataLength = patternSize * patternSize * 4;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      let newCssWidth = window.innerWidth;
      let newCssHeight = window.innerHeight;

      if (canvas.parentElement) {
        const parentRect = canvas.parentElement.getBoundingClientRect();
        newCssWidth = parentRect.width;
        newCssHeight = parentRect.height;
      }

      canvasCssSizeRef.current = { width: newCssWidth, height: newCssHeight };

      canvas.width = newCssWidth * dpr;
      canvas.height = newCssHeight * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const updatePattern = () => {
      for (let i = 0; i < patternPixelDataLength; i += 4) {
        const value = Math.random() * 255 * intensity;
        patternData.data[i] = value;
        patternData.data[i + 1] = value;
        patternData.data[i + 2] = value;
        patternData.data[i + 3] = patternAlpha;
      }
      patternCtx.putImageData(patternData, 0, 0);
    };

    const drawGrain = () => {
      const { width: cssWidth, height: cssHeight } = canvasCssSizeRef.current;
      if (cssWidth === 0 || cssHeight === 0) return;

      ctx.clearRect(0, 0, cssWidth, cssHeight);
      ctx.save();

      const safePatternScaleX = Math.max(0.001, patternScaleX);
      const safePatternScaleY = Math.max(0.001, patternScaleY);
      ctx.scale(safePatternScaleX, safePatternScaleY);

      const fillPattern = ctx.createPattern(patternCanvas, 'repeat');
      if (fillPattern) {
        ctx.fillStyle = fillPattern;
        ctx.fillRect(0, 0, cssWidth / safePatternScaleX, cssHeight / safePatternScaleY);
      }

      ctx.restore();
    };

    let animationFrameId: number;
    const loop = () => {
      if (canvasCssSizeRef.current.width > 0 && canvasCssSizeRef.current.height > 0) {
        if (frame % patternRefreshInterval === 0) {
          updatePattern();
          drawGrain();
        }
      }
      frame++;
      animationFrameId = window.requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize);
    resize();

    if (patternRefreshInterval > 0) {
      loop();
    } else {
      updatePattern();
      drawGrain();
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [patternSize, patternScaleX, patternScaleY, patternRefreshInterval, patternAlpha, intensity]);

  return <canvas className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-overlay" ref={grainRef} />;
}

export interface ColorStop {
  color: string;
  stop: string;
}

export interface GradientBackgroundProps {
  gradientType?: 'radial-gradient' | 'linear-gradient' | 'conic-gradient';
  gradientSize?: string;
  gradientOrigin?:
    | 'bottom-middle'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-middle'
    | 'top-left'
    | 'top-right'
    | 'left-middle'
    | 'right-middle'
    | 'center';
  colors?: ColorStop[];
  enableNoise?: boolean;
  noisePatternSize?: number;
  noisePatternScaleX?: number;
  noisePatternScaleY?: number;
  noisePatternRefreshInterval?: number;
  noisePatternAlpha?: number;
  noiseIntensity?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  customGradient?: string | null;
}

// Palette adaptée pour Agricx (Thème Nature, Forêt tropicale, Émeraude)
const AGRICX_LIGHT_COLORS: ColorStop[] = [
  { color: 'rgba(16, 185, 129, 0.18)', stop: '0%' },    // Emerald
  { color: 'rgba(5, 150, 105, 0.12)', stop: '25%' },   // Forest Green
  { color: 'rgba(52, 211, 153, 0.08)', stop: '50%' },   // Mint
  { color: 'rgba(245, 158, 11, 0.05)', stop: '75%' },   // Warm Sun / Gold
  { color: 'rgba(255, 255, 255, 0)', stop: '100%' },   // Transparent
];

const AGRICX_DARK_COLORS: ColorStop[] = [
  { color: 'rgba(6, 78, 59, 0.45)', stop: '0%' },     // Dark Emerald
  { color: 'rgba(4, 120, 87, 0.30)', stop: '30%' },    // Deep Forest
  { color: 'rgba(13, 148, 136, 0.20)', stop: '60%' },  // Teal
  { color: 'rgba(2, 44, 34, 0.60)', stop: '85%' },     // Deep Obsidian Green
  { color: 'rgba(2, 6, 23, 0.95)', stop: '100%' },     // Dark Slate
];

export function GradientBackground({
  gradientType = 'radial-gradient',
  gradientSize = '130% 130%',
  gradientOrigin = 'top-middle',
  colors,
  enableNoise = true,
  noisePatternSize = 100,
  noisePatternScaleX = 1,
  noisePatternScaleY = 1,
  noisePatternRefreshInterval = 2,
  noisePatternAlpha = 22,
  noiseIntensity = 0.7,
  className = '',
  style = {},
  children,
  customGradient = null,
}: GradientBackgroundProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === 'dark';
  const activeColors = colors || (isDark ? AGRICX_DARK_COLORS : AGRICX_LIGHT_COLORS);

  const generateGradient = () => {
    if (customGradient) return customGradient;

    const getGradientPosition = (origin: string) => {
      const positions: Record<string, string> = {
        'bottom-middle': '50% 101%',
        'bottom-left': '0% 101%',
        'bottom-right': '100% 101%',
        'top-middle': '50% -1%',
        'top-left': '0% -1%',
        'top-right': '100% -1%',
        'left-middle': '-1% 50%',
        'right-middle': '101% 50%',
        'center': '50% 50%',
      };
      return positions[origin] || positions['top-middle'];
    };

    const position = getGradientPosition(gradientOrigin);
    const colorStops = activeColors.map(({ color, stop }) => `${color} ${stop}`).join(',');

    if (gradientType === 'radial-gradient') {
      return `radial-gradient(${gradientSize} at ${position}, ${colorStops})`;
    } else if (gradientType === 'linear-gradient') {
      const angleMap: Record<string, string> = {
        'bottom-middle': '0deg',
        'bottom-left': '45deg',
        'bottom-right': '315deg',
        'top-middle': '180deg',
        'top-left': '135deg',
        'top-right': '225deg',
        'left-middle': '90deg',
        'right-middle': '270deg',
        'center': '0deg',
      };
      const angle = angleMap[gradientOrigin] || '180deg';
      return `linear-gradient(${angle}, ${colorStops})`;
    } else if (gradientType === 'conic-gradient') {
      return `conic-gradient(from 0deg at ${position}, ${colorStops})`;
    }

    return `${gradientType}(${colorStops})`;
  };

  const gradientStyle: React.CSSProperties = {
    background: generateGradient(),
    ...style,
  };

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 w-full h-full pointer-events-none z-[-1] overflow-hidden transition-colors duration-500 ${className}`}
      style={gradientStyle}
    >
      {enableNoise && (
        <Noise
          patternSize={noisePatternSize}
          patternScaleX={noisePatternScaleX}
          patternScaleY={noisePatternScaleY}
          patternRefreshInterval={noisePatternRefreshInterval}
          patternAlpha={isDark ? noisePatternAlpha * 1.2 : noisePatternAlpha}
          intensity={noiseIntensity}
        />
      )}
      {children}
    </div>
  );
}

export { Noise };
