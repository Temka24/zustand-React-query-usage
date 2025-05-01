import { NextRequest, NextResponse } from 'next/server';
import { CartItem } from '@/store/cartStore';

// Mock database with proper type safety
const mockCart: CartItem[] = [
    {
        id: 1,
        title: 'okey first',
        price: 2000,
        quantity: 1,
    },
    {
        id: 2,
        title: 'sec',
        price: 4000,
        quantity: 10,
    },
    {
        id: 3,
        title: 'jeans',
        price: 20,
        quantity: 5,
    },
    {
        id: 4,
        title: 'skirt',
        price: 100,
        quantity: 4,
    },
];

let cartStore: CartItem[] = [...mockCart];

export async function POST(req: NextRequest) {
    try {
        const { cart } = await req.json();

        // Basic validation
        if (!Array.isArray(cart)) {
            return NextResponse.json({ error: 'Invalid cart data format' }, { status: 400 });
        }

        cartStore = cart;
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error('Error processing cart:', error);
        return NextResponse.json({ error: 'Failed to process cart data' }, { status: 500 });
    }
}

export async function GET() {
    try {
        return NextResponse.json({ cart: cartStore });
    } catch (error: unknown) {
        console.error('Error fetching cart:', error);
        return NextResponse.json({ error: 'Failed to fetch cart data' }, { status: 500 });
    }
}
