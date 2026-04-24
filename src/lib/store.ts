import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  marque: string;
  modele: string;
  prix_fcfa: number;
  taille: string;
  quantite: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, taille: string) => void;
  updateQuantity: (id: string, taille: string, quantite: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.id === newItem.id && item.taille === newItem.taille
        );

        const qtyToAdd = newItem.quantite || 1;
        const price = Number(newItem.prix_fcfa) || 0;

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === newItem.id && item.taille === newItem.taille
                ? { ...item, quantite: item.quantite + qtyToAdd }
                : item
            ),
          });
        } else {
          set({ items: [...items, { ...newItem, quantite: qtyToAdd, prix_fcfa: price }] });
        }
      },
      removeItem: (id, taille) => {
        set({
          items: get().items.filter((item) => !(item.id === id && item.taille === taille)),
        });
      },
      updateQuantity: (id, taille, quantite) => {
        set({
          items: get().items.map((item) =>
            item.id === id && item.taille === taille ? { ...item, quantite } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      total: () => {
        return get().items.reduce((acc, item) => acc + item.prix_fcfa * item.quantite, 0);
      },
    }),
    {
      name: 'sneaker-cart',
    }
  )
);

interface UIStore {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
}));
