"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/lib/supabase';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col glass overflow-hidden cursor-pointer"
    >
      <Link href={`/products/${product.id}`} className="flex-1">
        <div className="relative aspect-square w-full overflow-hidden bg-white/5">
          <Image
            src={product.images[0]}
            alt={`${product.marque} ${product.modele}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {!product.disponible && (
            <div className="absolute top-4 right-4 z-10 bg-red-500 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
              Épuisé
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neon-cyan">
              {product.type}
            </span>
            <span className="text-xs text-white/40">{product.marque}</span>
          </div>
          <h3 className="mt-2 text-lg font-bold uppercase tracking-tighter text-white">
            {product.modele}
          </h3>
          <p className="mt-4 text-xl font-black text-white italic">
            {product.prix_fcfa.toLocaleString()} <span className="text-xs not-italic text-white/50">FCFA</span>
          </p>
        </div>
      </Link>
      
      <div className="flex h-12 w-full border-t border-white/10 opacity-0 transition-all duration-300 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
        <Link 
          href={`/products/${product.id}`}
          className="flex flex-1 items-center justify-center text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
        >
          Détails
        </Link>
        <div className="w-[1px] bg-white/10" />
        <button className="flex flex-1 items-center justify-center text-[10px] font-bold uppercase tracking-widest hover:bg-neon-cyan hover:text-black transition-colors">
          Aperçu
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
