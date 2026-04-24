"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import ProductCard from '@/components/shop/ProductCard';
import Cart from '@/components/cart/Cart';
import { supabase, Product } from '@/lib/supabase';
import { motion } from 'framer-motion';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(8);
      
      if (data) setProducts(data);
      setLoading(false);
    }
    getProducts();
  }, []);

  return (
    <main className="bg-[#050505] min-h-screen text-white">
      <Navbar />
      <Cart />
      
      <Hero />

      {/* Featured Section */}
      <section className="py-32 px-6 relative">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                DERNIÈRES <br />
                <span className="text-neon-cyan">ARRIVAGES</span>
              </h2>
              <div className="h-1 w-24 bg-neon-cyan" />
            </div>
            <p className="text-white/40 uppercase tracking-[0.2em] text-xs font-bold max-w-[200px] text-right">
              Découvrez les dernières tendances séléctionnées avec soin.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-20 text-center">
            <Link href="/shop">
              <button className="group relative px-12 py-6 overflow-hidden border border-white/10 uppercase text-xs font-black tracking-[0.3em] hover:text-black transition-colors duration-500">
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <span className="relative z-10">Voir toute la boutique</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <h3 className="text-neon-cyan font-bold uppercase tracking-widest text-sm">Authenticité</h3>
            <p className="text-white/50 text-sm">100% Certifié Original</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-neon-magenta font-bold uppercase tracking-widest text-sm">Livraison</h3>
            <p className="text-white/50 text-sm">Express en 24/48H</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-neon-green font-bold uppercase tracking-widest text-sm">Contact</h3>
            <p className="text-white/50 text-sm">Support client réactif</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-black italic tracking-tighter uppercase">
            Sneaker<span className="text-neon-cyan">Wear</span>
          </div>
          <p className="text-white/30 text-[10px] uppercase tracking-widest">
            © 2024 SneakerWear. Tout droits réservés.
          </p>
          <div className="flex gap-8 uppercase text-[10px] tracking-widest font-bold text-white/50">
            <a href="#" className="hover:text-neon-cyan transition-colors">Instagram</a>
            <a href="#" className="hover:text-neon-cyan transition-colors">WhatsApp</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
