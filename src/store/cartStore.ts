'use client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, devtools } from 'zustand/middleware';
import axios from 'axios';

export type Product = {
    id: number;
    title: string;
    price: number;
};

export type CartItem = Product & { quantity: number };

interface CartState {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (id: number) => void;
    increase: (id: number) => void;
    decrease: (id: number) => void;
    hydrate: (items: CartItem[]) => void;
    hydrated: boolean;
    syncToServer: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
    devtools(
        persist(
            immer((set, get) => ({
                cart: [],
                hydrated: false,
                addToCart: (product) => {
                    console.log('Adding to cart:', product);
                    set((state) => {
                        const exist = state.cart.find((i) => i.id === product.id);
                        if (exist) {
                            exist.quantity++;
                            console.log('Increased quantity of existing item:', exist);
                        } else {
                            const newItem = { ...product, quantity: 1 };
                            state.cart.push(newItem);
                            console.log('Added new item to cart:', newItem);
                        }
                        console.log('Updated cart:', state.cart);
                    });
                },
                removeFromCart: (id) =>
                    set((state) => {
                        state.cart = state.cart.filter((item: CartItem) => item.id !== id);
                    }),
                increase: (id) => {
                    set((state) => {
                        const item = state.cart.find((i: CartItem) => i.id === id);
                        if (item) {
                            item.quantity++;
                        }
                    });
                },
                decrease: (id) => {
                    set((state) => {
                        const item = state.cart.find((i: CartItem) => i.id === id);
                        if (item && item.quantity > 1) {
                            item.quantity--;
                        }
                    });
                },
                hydrate: (items) => {
                    if (!get().hydrated) {
                        set({ cart: items, hydrated: true });
                    }
                },
                syncToServer: async () => {
                    const cart = get().cart;
                    try {
                        const res = await axios.post('/api/cart', { cart });
                        alert(res.data.success);
                    } catch (err) {
                        console.error(err);
                    }
                },
            })),
            {
                name: 'cart-storage',
                onRehydrateStorage: () => (state) => {
                    console.log('Cart store rehydrated:', state);
                },
            },
        ),
    ),
);
