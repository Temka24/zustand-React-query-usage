'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export type ToDoType = {
    id: string;
    title: string;
};

const TODOS_KEY = ['todos'];

// 🟢 GET: fetch todos
export const useTodos = () =>
    useQuery<ToDoType[], AxiosError<{ message?: string }>, ToDoType[], string[]>({
        queryKey: ['todos'],
        queryFn: async () => {
            try {
                const res = await axios.get('/api/todos');
                return res.data;
            } catch (err) {
                const error = err as AxiosError<{ message?: string }>;
                toast.error(error.response?.data?.message ?? 'Todo татахад алдаа гарлаа');
                throw error;
            }
        },
        staleTime: 1000 * 60,
        retry: 1,
    });

// 🟢 POST: create todo
export const useCreateTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (title: string) => axios.post('/api/todos', { title }),

        onMutate: async (title) => {
            await queryClient.cancelQueries({ queryKey: TODOS_KEY });
            const prev = queryClient.getQueryData<ToDoType[]>(TODOS_KEY);

            queryClient.setQueryData<ToDoType[]>(TODOS_KEY, (old) => [
                { id: `temp-${Date.now()}`, title },
                ...(old ?? []),
            ]);

            return { prev };
        },

        onError: (err: AxiosError<{ message?: string }>, _, ctx) => {
            if (ctx?.prev) queryClient.setQueryData(TODOS_KEY, ctx.prev);
            toast.error(err.response?.data?.message ?? 'Todo үүсгэхэд алдаа гарлаа');
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: TODOS_KEY });
        },
    });
};

// 🟢 PUT: update todo
export const useUpdateTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, title }: { id: string; title: string }) =>
            axios.put('/api/todos', { id, title }),

        onMutate: async (updated) => {
            await queryClient.cancelQueries({ queryKey: TODOS_KEY });
            const prev = queryClient.getQueryData<ToDoType[]>(TODOS_KEY);

            queryClient.setQueryData<ToDoType[]>(TODOS_KEY, (old) =>
                old?.map((todo) =>
                    todo.id === updated.id ? { ...todo, title: updated.title } : todo,
                ),
            );

            return { prev };
        },

        onError: (err: AxiosError<{ message?: string }>, _, ctx) => {
            if (ctx?.prev) queryClient.setQueryData(TODOS_KEY, ctx.prev);
            toast.error(err.response?.data?.message ?? 'Todo шинэчлэхэд алдаа гарлаа');
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: TODOS_KEY });
        },
    });
};

// 🟢 DELETE: delete todo
export const useDeleteTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => axios.delete('/api/todos', { data: { id } }),

        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: TODOS_KEY });
            const prev = queryClient.getQueryData<ToDoType[]>(TODOS_KEY);

            queryClient.setQueryData<ToDoType[]>(TODOS_KEY, (old) =>
                old?.filter((todo) => todo.id !== id),
            );

            return { prev };
        },

        onError: (err: AxiosError<{ message?: string }>, _, ctx) => {
            if (ctx?.prev) queryClient.setQueryData(TODOS_KEY, ctx.prev);
            toast.error(err.response?.data?.message ?? 'Todo устгахад алдаа гарлаа');
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: TODOS_KEY });
        },
    });
};
