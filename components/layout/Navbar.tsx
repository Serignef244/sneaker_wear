"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useUIStore, useCartStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { toggleCart } = useUIStore();
  const cartItems = useCartStore((state) => state.items);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantite, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    { name: 'Sneakers', href: '/shop?type=chaussures' },
    { name: 'Vêtements', href: '/shop?type=vetements' },
    { name: 'Montres', href: '/shop?type=montres' },
    { name: 'Accessoires', href: '/shop?type=accessoires' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass border-white/5 px-6 py-4 rounded-2xl">
        <div className="flex items-center gap-10">
          <Link href="/" className="text-2xl font-black italic tracking-tighter text-white">
            SNEAKER<span className="text-neon-cyan">WEAR</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {categories.map((cat) => (
              <Link 
                key={cat.name} 
                href={cat.href}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-white/60 hover:text-neon-cyan transition-colors hidden md:block">
            <Search size={20} />
          </button>
          
          <button onClick={toggleCart} className="relative group p-2">
            <ShoppingBag className="text-white group-hover:text-neon-cyan transition-colors" size={24} />
            {itemCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-neon-magenta text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-[#050505]"
              >
                {itemCount}
              </motion.span>
            )}
          </button>

          <button 
            className="lg:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-6 right-6 glass p-8 rounded-2xl lg:hidden flex flex-col gap-6 items-center"
          >
            {categories.map((cat) => (
              <Link 
                key={cat.name} 
                href={cat.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-black uppercase italic tracking-widest text-white hover:text-neon-cyan"
              >
                {cat.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
