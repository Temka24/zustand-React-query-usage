'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';

export interface ToDoType {
    id: string;
    title: string;
}

export default function TodosPage() {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState('');

    const { data: todos, isLoading } = useQuery<ToDoType[]>({
        queryKey: ['todos'],
        queryFn: async () => {
            const res = await axios.get('/api/todos');
            return res.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: (title: string) => axios.post('/api/todos', { title }),
        onMutate: async (title) => {
            await queryClient.cancelQueries({ queryKey: ['todos'] });
            const prev = queryClient.getQueryData<ToDoType[]>(['todos']);
            queryClient.setQueryData<ToDoType[]>(['todos'], (old) => [
                { id: `temp-${Date.now()}`, title },
                ...(old ?? []),
            ]);
            return { prev };
        },
        onError: (_err, _data, ctx) => {
            if (ctx?.prev) queryClient.setQueryData(['todos'], ctx.prev);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => axios.delete(`/api/todos`, { data: { id } }),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['todos'] });
            const prev = queryClient.getQueryData<ToDoType[]>(['todos']);
            queryClient.setQueryData<ToDoType[]>(['todos'], (old) =>
                old?.filter((todo) => todo.id !== id),
            );
            return { prev };
        },
        onError: (_err, _id, ctx) => {
            if (ctx?.prev) queryClient.setQueryData(['todos'], ctx.prev);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, title }: { id: string; title: string }) =>
            axios.put(`/api/todos`, { title, id }),
        onMutate: async (updated) => {
            await queryClient.cancelQueries({ queryKey: ['todos'] });
            const prev = queryClient.getQueryData<ToDoType[]>(['todos']);
            queryClient.setQueryData<ToDoType[]>(['todos'], (old) =>
                old?.map((todo) =>
                    todo.id === updated.id ? { ...todo, title: updated.title } : todo,
                ),
            );
            return { prev };
        },
        onError: (_err, _data, ctx) => {
            if (ctx?.prev) queryClient.setQueryData(['todos'], ctx.prev);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

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
