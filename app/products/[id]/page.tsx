"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Cart from '@/components/cart/Cart';
import { supabase, Product } from '@/lib/supabase';
import { useCartStore, useUIStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);

  useEffect(() => {
    async function getProduct() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) {
        setProduct(data);
        if (data.tailles.length > 0) setSelectedSize(data.tailles[0]);
      }
      setLoading(false);
    }
    getProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white italic uppercase tracking-widest animate-pulse">Chargement de l'exclusivité...</div>;
  if (!product) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-black italic uppercase">Produit Introuvable</div>;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Veuillez sélectionner une taille");
      return;
    }
    addItem({ 
      id: product.id,
      marque: product.marque,
      modele: product.modele,
      prix_fcfa: product.prix_fcfa,
      image: product.images[0],
      taille: selectedSize,
      quantite: 1 
    });
    openCart();
  };

  return (
    <main className="bg-[#050505] min-h-screen text-white grainy-bg">
      <Navbar />
      <Cart />

      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Photos Section */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square glass overflow-hidden bg-white/5 border-white/5"
            >
              <img 
                src={product.images[activeImage]} 
                alt={product.modele} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </motion.div>
            
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square border-2 transition-all overflow-hidden ${activeImage === idx ? 'border-neon-cyan' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-10 lg:sticky lg:top-32">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-neon-cyan font-mono text-[10px] uppercase tracking-[0.3em] font-bold">New Release</span>
                <div className="flex text-neon-green">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-tight mb-2">
                {product.marque} <br/>
                <span className="text-transparent" style={{ WebkitTextStroke: '1px white' }}>{product.modele}</span>
              </h1>
              <p className="text-3xl font-black text-neon-cyan italic">{product.prix_fcfa.toLocaleString()} FCFA</p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Sélectionner Taille</h3>
                <span className="text-[10px] text-white/30 italic underline cursor-pointer hover:text-white transition-colors uppercase">Guide des tailles</span>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {product.tailles.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-14 flex items-center justify-center font-bold text-sm transition-all border ${selectedSize === size ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'border-white/10 text-white/50 hover:border-white/30'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-10">
              <button 
                onClick={handleAddToCart}
                disabled={!product.disponible}
                className="w-full py-6 flex items-center justify-center gap-4 bg-neon-cyan text-black font-black uppercase text-xs tracking-[0.4em] hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-500 disabled:opacity-50"
              >
                <ShoppingBag size={20} /> Ajouter au panier
              </button>
              <p className="text-[10px] text-white/30 text-center uppercase tracking-widest italic">
                Livraison express gratuite à partir de 50 000 FCFA
              </p>
            </div>

            <div className="border-t border-white/5 pt-10 space-y-4">
              <p className="text-white/40 text-sm leading-relaxed">
                Ce modèle iconique marie harmonieusement héritage et innovation technologique. Conçu pour le confort quotidien sans sacrifier l'esthétique premium de notre boutique.
              </p>
              <ul className="text-[10px] uppercase tracking-widest text-white/30 space-y-2">
                <li>• Matériaux premium séléctionnés</li>
                <li>• Amorti haute performance</li>
                <li>• Design en édition limitée</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
