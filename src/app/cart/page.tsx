'use client';
import React, { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import axios from 'axios';

const CartPage: React.FC = () => {
    const cart = useCartStore((s) => s.cart);
    const remove = useCartStore((s) => s.removeFromCart);
    const increase = useCartStore((s) => s.increase);
    const decrease = useCartStore((s) => s.decrease);
    const hydrate = useCartStore((s) => s.hydrate);
    const sync = useCartStore((s) => s.syncToServer);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCart = async () => {
            try {
                const res = await axios.get('/api/cart');
                hydrate(res.data.cart || []);
                console.log(res.data.cart);
            } catch (err) {
                console.error(err);
                setError('Failed to load cart');
            }
        };
        loadCart();
    }, [hydrate]);

    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        const res = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
        setTotal(res);
    }, [cart]);

    const handleSync = async () => {
        try {
            setIsLoading(true);
            setError(null);
            await sync();
        } catch (err) {
            console.error(err);
            setError('Failed to sync cart');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="p-6 max-w-2xl mx-auto">
                <h1 className="text-xl font-bold mb-4">🛒 Cart</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <ul className="space-y-4">
                    {cart.map((item) => (
                        <li key={item.id} className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{item.title}</p>
                                <p>
                                    ${item.price} x {item.quantity}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => decrease(item.id)}>-</button>
                                <button onClick={() => increase(item.id)}>+</button>
                                <button onClick={() => remove(item.id)} className="text-red-500">
                                    ❌
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                <p className="mt-4 font-bold text-lg">Total: ${total}</p>
                <button
                    onClick={handleSync}
                    disabled={isLoading}
                    className={`mt-4 bg-blue-600 text-white px-4 py-2 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? 'Syncing...' : 'Sync to Server'}
                </button>
            </div>
        </>
    );
};

export default CartPage;
