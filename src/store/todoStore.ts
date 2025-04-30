import { create } from 'zustand';

type Todo = {
    id: number;
    text: string;
    done: boolean;
};

interface TodoState {
    todos: Todo[];
    addTodo: (text: string) => void;
    toggleTodo: (id: number) => void;
    removeTodo: (id: number) => void;
}

export const useToduStore = create<TodoState>((set) => ({
    todos: [],
    addTodo: (text) =>
        set((state) => ({
            todos: [...state.todos, { id: Date.now(), text, done: false }],
        })),
    toggleTodo: (id) =>
        set((state) => ({
            todos: state.todos.map((todo) =>
                todo.id === id ? { ...todo, done: !todo.done } : todo,
            ),
        })),
    removeTodo: (id) =>
        set((state) => ({
            todos: state.todos.filter((todo) => todo.id !== id),
        })),
}));
