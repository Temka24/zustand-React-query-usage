import { NextResponse, NextRequest } from 'next/server';

let todos = [
    { id: '1', title: 'Learn React Query' },
    { id: '2', title: 'Build a CRUD App' },
];

export async function GET() {
    return NextResponse.json(todos);
}

export async function POST(req: NextRequest) {
    const { title } = await req.json();
    const newTodo = { id: Date.now().toString(), title };
    todos.unshift(newTodo);
    return NextResponse.json(newTodo);
}

export async function PUT(req: NextRequest) {
    const { id, title } = await req.json();
    todos = todos.map((todo) => (todo.id === id ? { ...todo, title } : todo));
    return NextResponse.json({ status: true });
}

export async function DELETE(req: NextRequest) {
    const { id } = await req.json();
    todos = todos.filter((todo) => todo.id !== id);
    return NextResponse.json({ status: true });
}
