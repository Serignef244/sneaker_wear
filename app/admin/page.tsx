"use client";

import React, { useState, useEffect } from 'react';
import { supabase, Product } from '@/lib/supabase';
import { Lock, Plus, Trash2, Edit, LogOut, Package, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    marque: '',
    modele: '',
    prix_fcfa: 0,
    type: 'chaussures',
    tailles: [] as string[],
    couleur: '',
    disponible: true
  });
  const [images, setImages] = useState<File[]>([]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "sneaker2024";
    if (password === adminPass) {
      setIsAuthenticated(true);
      fetchProducts();
    } else {
      alert("Accès refusé ! Mot de passe incorrect.");
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProducts(data);
    setIsLoading(false);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const uploadedUrls = [];

      for (const file of images) {
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        
        uploadedUrls.push(publicUrl);
      }

      const { error: insertError } = await supabase
        .from('products')
        .insert([{ ...formData, images: uploadedUrls }]);

      if (insertError) throw insertError;

      alert("Produit ajouté avec succès !");
      setIsModalOpen(false);
      fetchProducts();
    } catch (error: any) {
      alert("Erreur: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer ce produit ?")) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) fetchProducts();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 grainy-bg">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-10 max-w-md w-full border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-green" />
          <div className="text-center space-y-6">
            <div className="inline-flex p-5 rounded-full bg-white/5 text-neon-cyan border border-white/10 ring-8 ring-white/5">
              <Lock size={32} />
            </div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
              ADMIN <span className="text-neon-cyan">PORTAL</span>
            </h1>
            <p className="text-xs text-white/40 uppercase tracking-widest leading-relaxed">
              Veuillez entrer le code d'accès pour gérer l'inventaire.
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-5 text-white focus:border-neon-cyan outline-none transition-all font-mono"
                placeholder="********"
              />
              <button 
                type="submit" 
                className="w-full bg-white text-black py-5 font-black uppercase text-xs tracking-[0.3em] hover:bg-neon-cyan transition-all duration-500 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
              >
                Identification
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6 grainy-bg text-white">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="space-y-2">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter">
              DASHBOARD <span className="text-neon-magenta">STOCK</span>
            </h2>
            <p className="text-xs font-mono text-white/40 flex items-center gap-2 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" /> Système de gestion en ligne
            </p>
          </div>
          
          <div className="flex gap-4">
             <button 
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-neon-green text-black font-black uppercase text-xs tracking-widest flex items-center gap-3 hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all"
             >
               <Plus size={18} /> AJOUTER SNEAKER
             </button>
             <button onClick={() => setIsAuthenticated(false)} className="p-4 bg-white/5 text-white/50 hover:text-white transition-all border border-white/10 hover:bg-white/10">
               <LogOut size={20} />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {products.map((product) => (
              <motion.div 
                key={product.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass p-6 flex flex-col md:flex-row items-center justify-between border-white/5 hover:border-white/20 transition-all group"
              >
                <div className="flex items-center gap-8 w-full md:w-auto">
                  <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-white/5 group-hover:scale-105 transition-transform">
                    <img src={product.images[0]} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-black text-xl text-white uppercase italic tracking-tight">{product.modele}</h4>
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/60 uppercase">{product.marque}</span>
                    </div>
                    <div className="flex gap-4 text-[10px] uppercase tracking-widest text-white/40">
                      <span>{product.prix_fcfa.toLocaleString()} FCFA</span>
                      <span>•</span>
                      <span>Type: {product.type}</span>
                      <span>•</span>
                      <span>Tailles: {product.tailles.join(', ')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6 md:mt-0">
                  <button className="p-4 bg-white/5 text-white/40 hover:text-white transition-all hover:bg-white/10 border border-white/10">
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="p-4 bg-red-500/10 text-red-500/50 hover:text-red-500 transition-all border border-red-500/20 hover:bg-red-500/20"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {products.length === 0 && !isLoading && (
            <div className="text-center py-40 glass border-dashed">
              <Package size={48} className="mx-auto text-white/10 mb-4" />
              <p className="text-white/30 uppercase tracking-widest">Aucun produit dans l'inventaire</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Ajout (Simplifié pour la démo) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass max-w-2xl w-full p-8 relative overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <h3 className="text-3xl font-black uppercase italic mb-8">Nouveau <span className="text-neon-cyan">Produit</span></h3>
              <form onSubmit={handleUpload} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/50">Marque</label>
                    <input required className="w-full bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-neon-cyan" 
                      onChange={(e) => setFormData({...formData, marque: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/50">Modèle</label>
                    <input required className="w-full bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-neon-cyan" 
                      onChange={(e) => setFormData({...formData, modele: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/50">Prix (FCFA)</label>
                    <input required type="number" className="w-full bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-neon-cyan" 
                      onChange={(e) => setFormData({...formData, prix_fcfa: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/50">Catégorie</label>
                    <select className="w-full bg-[#111] border border-white/10 p-4 text-white outline-none focus:border-neon-cyan"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}>
                      <optgroup label="👟 Sneakers">
                        <option value="chaussures">Chaussures / Sneakers</option>
                      </optgroup>
                      <optgroup label="👕 Vêtements">
                        <option value="vetements">Vêtements (Hauts, Bas, Tenues)</option>
                        <option value="maillots">Maillots de Sport</option>
                      </optgroup>
                      <optgroup label="⌚ Montres">
                        <option value="montres">Montres</option>
                      </optgroup>
                      <optgroup label="🎒 Accessoires">
                        <option value="casquettes">Casquettes</option>
                        <option value="sac">Sacs</option>
                        <option value="accessoires">Autres Accessoires</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/50">Tailles (séparées par des virgules)</label>
                  <input required placeholder="39, 40, 41, 42" className="w-full bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-neon-cyan" 
                    onChange={(e) => setFormData({...formData, tailles: e.target.value.split(',').map(s => s.trim())})} />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-white/50">Photos (Séléctionnez une ou plusieurs)</label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {images.map((file, i) => (
                      <div key={i} className="aspect-square bg-white/5 border border-white/10 relative group overflow-hidden">
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                        <button 
                          type="button"
                          onClick={() => setImages(images.filter((_, index) => index !== i))}
                          className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="w-full bg-white/5 border border-white/10 p-8 text-sm file:bg-neon-cyan file:border-0 file:px-4 file:py-1 file:mr-4 font-bold text-white/40" 
                    onChange={(e) => {
                      const newFiles = Array.from(e.target.files || []);
                      setImages([...images, ...newFiles]);
                      e.target.value = ''; // Reset input to allow re-selection
                    }} 
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" disabled={isLoading} className="flex-1 bg-white text-black py-4 font-black uppercase text-xs tracking-widest hover:bg-neon-cyan transition-all disabled:opacity-50">
                    {isLoading ? "Chargement..." : "Publier"}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 border border-white/10 uppercase text-xs font-bold hover:bg-white/5 transition-all">
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
