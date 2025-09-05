'use client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, devtools } from 'zustand/middleware';

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
                addToCart: (product) => {
                    set((state) => {
                        const exist = state.cart.find((i) => i.id === product.id);
                        if (exist) {
                            exist.quantity++;
                        } else {
                            const newItem = { ...product, quantity: 1 };
                            state.cart.push(newItem);
                        }
                    });
                },
                removeFromCart: (id) => {
                    set((state) => {
                        state.cart = state.cart.filter((item: CartItem) => item.id !== id);
                    });},
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
                clearCart: () => set((state) => { state.cart = [] }),
                count: () => get().cart.reduce((n, i) => n + i.quantity, 0),
                total: () => get().cart.reduce((n, i) => n + i.quantity * i.price, 0),
            })),
            {
                name: 'cart-storage',
            },
        ),
    ),
);
