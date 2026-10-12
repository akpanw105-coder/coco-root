"use client";

import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import Image from "next/image";

interface HeroMediaProps {
  priority?: boolean;
}

const CLOUDINARY_VIDEO_URL =
  "https://res.cloudinary.com/oebaqlvj/video/upload/v1791583646/Hair_cream_product_animation_20261009141854.mp4";

// Exact poster frame matching the opening of the 3D hair cream animation
const ANIMATION_POSTER_URL =
  "https://res.cloudinary.com/oebaqlvj/video/upload/so_0,eo_1,f_jpg,q_auto/v1791583646/Hair_cream_product_animation_20261009141854.jpg";

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => {};
  }
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", callback);
    return () => mediaQuery.removeEventListener("change", callback);
  }
  return () => {};
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function HeroMedia({ priority = true }: HeroMediaProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion || hasVideoError) return;

    // Check if the video is already playing or ready
    if (video.readyState >= 3) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Browser autoplay policy blocked
          });
      }
    } else {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Will trigger on 'playing' event if started subsequently
          });
      }
    }
  }, [prefersReducedMotion, hasVideoError]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Botanical Soft Radial Light Atmosphere */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[360px] sm:w-[540px] lg:w-[720px] h-[360px] sm:h-[540px] lg:h-[720px] rounded-full bg-radial from-[#C4975C]/15 via-[#8DA394]/8 to-transparent blur-3xl opacity-70" />
      </div>

      {/* Main Luxury Stage Container */}
      <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_24px_70px_-15px_rgba(20,36,27,0.3)] bg-[#070D09] border border-white/10 group isolate">
        {/*
          1. Genuine Reduced-Motion or Playback Failure Fallback
          Only rendered if the user has requested reduced motion or the video failed entirely.
        */}
        {(prefersReducedMotion || hasVideoError) && (
          <Image
            src="/images/hero-product.jpg"
            alt="COCO ROOTS Hair Cream & Botanical Scalp Formula luxury product presentation"
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            className="object-cover object-center animate-in fade-in duration-500"
          />
        )}

        {/*
          2. The Cloudinary 3D Product Animation
          Active by default when reduced motion is not requested.
          Uses ANIMATION_POSTER_URL so the very first rendered frame is the opening jar of the animation,
          never the Phase 1 static table photograph.
        */}
        {!prefersReducedMotion && !hasVideoError && (
          <video
            ref={videoRef}
            src={CLOUDINARY_VIDEO_URL}
            poster={ANIMATION_POSTER_URL}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="Cinematic 3D animation of Coco Roots nourishing botanical hair cream with active coconut emulsion"
            onPlaying={() => setIsPlaying(true)}
            onLoadedData={() => {
              if (videoRef.current) {
                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                  playPromise.then(() => setIsPlaying(true)).catch(() => {});
                }
              }
            }}
            onError={() => setHasVideoError(true)}
            className="absolute inset-0 w-full h-full object-contain md:object-cover object-center"
          />
        )}

        {/* Premium subtle editorial vignette over video edges for seamless integration */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none z-10" />

        {/* Bottom Floating Campaign Tag */}
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 flex items-center gap-2.5 bg-[#0D1812]/80 backdrop-blur-md px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/15 text-[10px] sm:text-xs font-medium tracking-wider text-[#FBF9F5] uppercase shadow-lg">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#C4975C] animate-pulse" />
          <span className="font-sans font-medium text-white/90">
            {prefersReducedMotion || hasVideoError
              ? "Signature Botanical Formula"
              : isPlaying
              ? "Nourishing Hair Cream • 3D Film"
              : "Nourishing Hair Cream"}
          </span>
        </div>

        {/* Top Right Luxury Accreditation */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 hidden sm:flex items-center gap-2 bg-[#FBF9F5]/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#14241B]/10 text-[11px] font-serif tracking-widest text-[#14241B] uppercase shadow-md">
          <span>Cold-Pressed Coconut Lipids</span>
        </div>
      </div>
    </div>
  );
}
