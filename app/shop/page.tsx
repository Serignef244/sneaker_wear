"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Cart from '@/components/cart/Cart';
import ProductCard from '@/components/shop/ProductCard';
import { supabase, Product } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, SlidersHorizontal } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBrand, setActiveBrand] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [activeType, setActiveType] = useState(typeParam || 'All');

  useEffect(() => {
    setActiveType(typeParam || 'All');
  }, [typeParam]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let query = supabase.from('products').select('*').order('created_at', { ascending: false });
      
      const { data } = await query;
      
      if (data) {
        setProducts(data);
        applyFilters(data, activeBrand, activeType);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [activeType]);

  const applyFilters = (allProducts: Product[], brand: string, type: string) => {
    let filtered = allProducts;
    if (brand !== 'All') {
      filtered = filtered.filter(p => p.marque === brand);
    }
    if (type !== 'All') {
      filtered = filtered.filter(p => p.type === type);
    }
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    applyFilters(products, activeBrand, activeType);
  }, [activeBrand, activeType, products]);

  const brands = ['All', ...Array.from(new Set(products.map(p => p.marque)))];
  const types = ['All', 'chaussures', 'vetements', 'montres', 'accessoires'];

  return (
    <>
      <div className="pt-32 pb-20 container mx-auto px-6">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-4"
            >
              {activeType === 'All' ? 'La ' : ''}
              <span className="text-neon-cyan">{activeType === 'All' ? 'Collection' : activeType}</span>
            </motion.h1>
            <p className="text-white/40 uppercase tracking-widest text-xs font-bold">
              {filteredProducts.length} Produits disponibles
            </p>
          </div>

          <button 
            onClick={() => setShowFilters(true)}
            className="md:hidden flex items-center gap-2 px-6 py-3 glass border-white/10 text-[10px] font-bold uppercase tracking-widest"
          >
            <SlidersHorizontal size={14} /> Filtres
          </button>

          <div className="hidden md:flex flex-wrap gap-4">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setActiveBrand(brand)}
                className={`px-6 py-2 border font-bold text-[10px] uppercase tracking-[0.2em] transition-all rounded-full ${activeBrand === brand ? 'bg-white text-black border-white' : 'border-white/10 text-white/40 hover:border-white/30'}`}
              >
                {brand}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </div>

      {/* Mobile Filter Bottom Sheet */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm md:hidden"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 z-[90] bg-dark-bg p-8 rounded-t-[32px] md:hidden border-t border-white/10"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black uppercase italic">Filtres</h3>
                <button onClick={() => setShowFilters(false)} className="p-2 bg-white/5 rounded-full">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4 font-bold">Marques</h4>
                  <div className="flex flex-wrap gap-2">
                    {brands.map(brand => (
                      <button 
                        key={brand} 
                        onClick={() => setActiveBrand(brand)}
                        className={`px-4 py-2 text-[10px] font-bold uppercase border ${activeBrand === brand ? 'bg-white text-black border-white' : 'border-white/10 text-white/60'}`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4 font-bold">Catégories</h4>
                  <div className="flex flex-wrap gap-2">
                    {types.map(t => (
                      <button 
                        key={t} 
                        onClick={() => setActiveType(t)}
                        className={`px-4 py-2 text-[10px] font-bold uppercase border ${activeType === t ? 'bg-neon-cyan text-black border-neon-cyan' : 'border-white/10 text-white/60'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowFilters(false)}
                className="w-full mt-12 bg-white text-black py-4 font-black uppercase text-xs tracking-widest"
              >
                Appliquer
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default function ShopPage() {
  return (
    <main className="bg-[#050505] min-h-screen text-white grainy-bg">
      <Navbar />
      <Cart />
      <Suspense fallback={<div className="pt-40 text-center uppercase font-black italic animate-pulse">Initialisation...</div>}>
        <ShopContent />
      </Suspense>
    </main>
  );
}
