'use client';
import { useState } from 'react';
import { useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo } from '@/app/hooks/useTodos';

export interface ToDoType {
    id: string;
    title: string;
}

export default function TodosPage() {
    const { data: todos, isLoading } = useTodos();
    const createMutation = useCreateTodo();
    const updateMutation = useUpdateTodo();
    const deleteMutation = useDeleteTodo();

    const [title, setTitle] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        createMutation.mutate(title);
        setTitle('');
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Todo List</h1>

            <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="New todo"
                    className="border px-2 py-1 flex-1"
                />
                <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
                    Add
                </button>
            </form>

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul className="space-y-2">
                    {todos?.map((todo: ToDoType) => (
                        <li
                            key={todo.id}
                            className="flex justify-between items-center border p-2 rounded"
                        >
                            {editingId === todo.id ? (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        updateMutation.mutate({ id: todo.id, title: editingTitle });
                                        setEditingId(null);
                                    }}
                                    className="flex gap-2 items-center w-full"
                                >
                                    <input
                                        value={editingTitle}
                                        onChange={(e) => setEditingTitle(e.target.value)}
                                        className="flex-1 border px-2 py-1"
                                    />
                                    <button type="submit" className="text-green-600">
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingId(null)}
                                        className="text-gray-500"
                                    >
                                        Cancel
                                    </button>
                                </form>
                            ) : (
                                <>
                                    <span>
                                        {todo.title} for {todo.id}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingId(todo.id);
                                                setEditingTitle(todo.title);
                                            }}
                                            className="text-blue-500"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteMutation.mutate(todo.id)}
                                            className="text-red-500"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
