"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ctx = gsap.context(() => {
        // Animation d'entrée
        gsap.from(textRef.current, {
          y: 100,
          opacity: 0,
          duration: 1.5,
          ease: "power4.out",
          delay: 0.2
        });

        // Effet Parallaxe au scroll
        gsap.to(imageRef.current, {
          y: -80,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5
          }
        });
      }, containerRef);

      return () => ctx.revert();
    }
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 grainy-bg">
      {/* Background Neon Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-cyan/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-magenta/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div ref={textRef}>
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-neon-cyan font-mono text-xs tracking-[0.4em] uppercase mb-6 block"
          >
            L'excellence à chaque pas
          </motion.span>
          <h1 className="text-7xl md:text-9xl font-black uppercase italic leading-[0.85] tracking-tighter mb-10">
            ELITE <br />
            <span 
               className="text-transparent" 
               style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}
            >
              KICKS
            </span>
          </h1>
          <p className="text-lg text-white/50 max-w-sm mb-12 leading-relaxed font-light">
            Séléction exclusive des sneakers les plus rares. <br/>
            Redéfinissez votre style avec nos pièces limitées.
          </p>
          <div className="flex flex-wrap gap-6">
            <button className="px-10 py-5 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-neon-cyan hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all duration-500">
              Shopper maintenant
            </button>
            <button className="px-10 py-5 border border-white/10 text-white font-bold uppercase text-xs tracking-widest hover:border-white/40 transition-all duration-300 flex items-center gap-3 group">
              Collections <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        <div className="relative" ref={imageRef}>
          <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 rounded-full blur-[100px] opacity-40 animate-pulse" />
          <img 
            src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=85&w=1200" 
            alt="Premium Sneaker"
            className="relative z-10 w-full h-auto drop-shadow-[0_50px_50px_rgba(0,0,0,0.8)] transform -rotate-[15deg] hover:rotate-0 transition-transform duration-1000 ease-out"
          />
          {/* Decorative tag */}
          <div className="absolute -bottom-10 -right-4 glass px-6 py-4 z-20">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Stock Limité</p>
            <p className="text-xl font-bold italic tracking-tighter">AJ1 RETRO HIGH</p>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-neon-cyan/50 to-transparent relative overflow-hidden">
          <div className="absolute inset-0 bg-white/40 h-1/2 animate-bounce transition-all" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
