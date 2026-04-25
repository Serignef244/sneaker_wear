"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Cart from '@/components/cart/Cart';
import ProductCard from '@/components/shop/ProductCard';
import { supabase, Product } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, SlidersHorizontal } from 'lucide-react';

// Mapping catégorie visible → types en base de données
const CATEGORY_MAP: Record<string, string[]> = {
  'All':        [],
  'sneakers':   ['chaussures'],
  'vetements':  ['vetements', 'maillots'],
  'montres':    ['montres'],
  'accessoires':['casquettes', 'sac', 'accessoires'],
};

const CATEGORY_LABELS: Record<string, string> = {
  'All':        'La Collection',
  'sneakers':   '👟 Sneakers',
  'vetements':  '👕 Vêtements',
  'montres':    '⌚ Montres',
  'accessoires':'🎒 Accessoires',
};

function ShopContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBrand, setActiveBrand] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState(typeParam || 'All');

  useEffect(() => {
    setActiveCategory(typeParam || 'All');
  }, [typeParam]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filtre par catégorie
    const typesToShow = CATEGORY_MAP[activeCategory];
    if (typesToShow && typesToShow.length > 0) {
      filtered = filtered.filter(p => typesToShow.includes(p.type));
    }

    // Filtre par marque
    if (activeBrand !== 'All') {
      filtered = filtered.filter(p => p.marque === activeBrand);
    }

    setFilteredProducts(filtered);
  }, [activeBrand, activeCategory, products]);

  const brands = ['All', ...Array.from(new Set(products.map(p => p.marque)))];
  const categories = Object.keys(CATEGORY_MAP);

  return (
    <>
      <div className="pt-32 pb-20 container mx-auto px-6">
        <header className="mb-12 flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-2">
              <span className="text-neon-cyan">{CATEGORY_LABELS[activeCategory]}</span>
            </h1>
            <p className="text-white/40 uppercase tracking-widest text-xs font-bold">
              {filteredProducts.length} Produits disponibles
            </p>
          </motion.div>

          {/* Filtres Catégories — Desktop & Mobile */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 border font-bold text-[10px] uppercase tracking-[0.2em] transition-all ${
                    activeCategory === cat
                      ? 'bg-neon-cyan text-black border-neon-cyan shadow-[0_0_15px_rgba(0,255,255,0.3)]'
                      : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>

            {/* Filtre Marques */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[10px] text-white/30 uppercase tracking-widest mr-2">Marque :</span>
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setActiveBrand(brand)}
                  className={`px-4 py-1.5 border font-bold text-[10px] uppercase tracking-[0.2em] transition-all rounded-full ${
                    activeBrand === brand
                      ? 'bg-white text-black border-white'
                      : 'border-white/10 text-white/40 hover:border-white/30'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-40 text-center">
            <p className="text-white/20 uppercase font-black italic text-2xl">Aucun produit dans cette catégorie</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
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
