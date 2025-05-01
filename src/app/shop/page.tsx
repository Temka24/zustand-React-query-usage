'use client';
import React from 'react';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/store/cartStore';
import { useRouter } from 'next/navigation';

const products: Product[] = [
    { id: 10, title: 'Shirt', price: 25 },
    { id: 20, title: 'Jeans', price: 45 },
    { id: 30, title: 'Sneakers', price: 70 },
    { id: 40, title: 'Hat', price: 15 },
];

const Shoppage = () => {
    const addToCart = useCartStore((s) => s.addToCart);
    const router = useRouter();
    return (
        <>
            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">🛍️ Products</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map((product: Product) => (
                        <div
                            key={product.id}
                            className="border p-4 rounded shadow hover:shadow-lg transition"
                        >
                            <h2 className="text-lg font-semibold mb-1">{product.title}</h2>
                            <p className="text-gray-600 mb-2">${product.price}</p>
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded"
                                onClick={() => {
                                    addToCart(product);
                                    alert('okey');
                                }}
                            >
                                ➕ Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
                <div onClick={() => router.push('/cart')}>To Cart</div>
            </div>
        </>
    );
};

export default Shoppage;
