'use client';
import React, { useState } from 'react';
import { useToduStore } from '@/store/todoStore';

const TodoPage: React.FC = () => {
    const [text, setText] = useState<string>('');
    const { todos, addTodo, toggleTodo, removeTodo } = useToduStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addTodo(text);
        setText('');
    };
    return (
        <>
            <div className="p-4 max-w-[1600px] w-screen mx-auto">
                <h1 className="text-2xl font-bold mb-4">ToDo List</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        className="border p-2 w-full rounded"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Add new todo"
                    />
                    <input
                        type="submit"
                        value="Add"
                        className="bg-blue-500 text-white px-4 rounded"
                    />
                </form>

                <ul>
                    {todos.map((todo) => (
                        <li key={todo.id} className="flex justify-between items-center mb-2">
                            <span
                                onClick={() => toggleTodo(todo.id)}
                                className={`cursor-pointer ${
                                    todo.done ? 'line-through text-gray-500' : ''
                                }`}
                            >
                                {todo.text}
                            </span>
                            <button className="text-red-500" onClick={() => removeTodo(todo.id)}>
                                ❌
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default TodoPage;
