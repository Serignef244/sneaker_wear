"use client";

import React from 'react';
import { useUIStore, useCartStore } from '@/lib/store';
import { X, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const { isCartOpen, closeCart } = useUIStore();
  const { items, removeItem, updateQuantity, total } = useCartStore();

  const [customerInfo, setCustomerInfo] = React.useState({ name: '', address: '', phone: '' });

  const hapticFeedback = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
  };

  const handleWhatsAppOrder = () => {
    hapticFeedback();
    if (!customerInfo.name || !customerInfo.address || !customerInfo.phone) {
      alert("Veuillez remplir vos informations de livraison.");
      return;
    }

    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "221775548799";
    let message = `🛍️ *NOUVELLE COMMANDE*\n\n`;
    message += `👤 *Client:* ${customerInfo.name}\n`;
    message += `📍 *Adresse:* ${customerInfo.address}\n`;
    message += `📞 *Tel:* ${customerInfo.phone}\n\n`;
    message += `🛒 *PANIER:*\n`;
    
    items.forEach((item) => {
      message += `- ${item.marque} ${item.modele} (Taille: ${item.taille}) x${item.quantite} = ${(item.prix_fcfa * item.quantite).toLocaleString()} FCFA\n`;
    });
    
    message += `\n💰 *TOTAL : ${total().toLocaleString()} FCFA*`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${number}?text=${encodedMessage}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-dark-bg p-8 shadow-2xl border-l border-white/5 overflow-y-auto"
          >
            <div className="flex min-h-full flex-col">
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <h2 className="text-2xl font-bold tracking-tight text-white uppercase italic">
                  Votre <span className="text-neon-magenta">Panier</span>
                </h2>
                <button onClick={closeCart} className="text-white/50 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 py-6 space-y-8">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center space-y-4 opacity-50 py-20">
                    <ShoppingCart size={48} />
                    <p className="text-lg uppercase tracking-widest font-bold">Votre panier est vide</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-6">
                      {items.map((item) => (
                        <div key={`${item.id}-${item.taille}`} className="flex space-x-4 border-b border-white/5 pb-4">
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-white/5">
                            <img src={item.image} alt={item.modele} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <h3 className="text-sm font-bold text-white uppercase">{item.marque}</h3>
                              <p className="text-xs text-white/60">{item.modele} - T{item.taille}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => { updateQuantity(item.id, item.taille, Math.max(1, item.quantite - 1)); hapticFeedback(); }}
                                  className="p-1 text-white/50 hover:text-neon-cyan"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="text-sm font-medium">{item.quantite}</span>
                                <button 
                                  onClick={() => { updateQuantity(item.id, item.taille, item.quantite + 1); hapticFeedback(); }}
                                  className="p-1 text-white/50 hover:text-neon-cyan"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                              <p className="text-sm font-bold text-neon-cyan">{(item.prix_fcfa * item.quantite).toLocaleString()} FCFA</p>
                              <button 
                                onClick={() => { removeItem(item.id, item.taille); hapticFeedback(); }}
                                className="text-white/30 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 border-t border-white/10 pt-6">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Informations de livraison</h4>
                      <input 
                        type="text" placeholder="Nom Complet"
                        className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white outline-none focus:border-neon-cyan"
                        value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      />
                      <input 
                        type="text" placeholder="Adresse Exacte"
                        className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white outline-none focus:border-neon-cyan"
                        value={customerInfo.address} onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      />
                      <input 
                        type="text" placeholder="Numéro de Téléphone"
                        className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white outline-none focus:border-neon-cyan"
                        value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      />
                    </div>
                  </>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-white/10 pt-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-white/70 uppercase tracking-widest">Total</span>
                    <span className="text-2xl font-black text-white">{total().toLocaleString()} FCFA</span>
                  </div>
                  <button 
                    onClick={handleWhatsAppOrder}
                    className="w-full bg-neon-green py-5 text-xs font-black uppercase tracking-[0.2em] text-black transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(57,255,20,0.4)]"
                  >
                    🚀 Confirmer sur WhatsApp
                  </button>
                  <button 
                      onClick={() => { useCartStore.getState().clearCart(); hapticFeedback(); }}
                      className="w-full text-center text-[10px] uppercase tracking-widest text-white/20 hover:text-red-500 transition-colors"
                    >
                      Vider le panier
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;
