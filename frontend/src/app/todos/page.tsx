"use client";

import { useEffect, useState } from "react";

type Todo = {
    id: number;
    title: string;
    isDone: boolean;
    createdAt: string;
    updatedAt: string;
};

type TodoResponse = {
    success: boolean;
    data: Todo[];
};

export default function TodoPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");

    const fetchTodos = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/todos`,
            );
            const result: TodoResponse = await res.json();

            if (result.success) setTodos(result.data);
        } catch (error) {
            console.error("Fetch todos error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const createTodo = async () => {
        if (!title.trim()) return;

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title }),
            });

            setTitle("");
            fetchTodos();
        } catch (error) {
            console.error(error);
        }
    };

    const toggleTodo = async (todo: Todo) => {
        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/todos/${todo.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isDone: !todo.isDone }),
                },
            );

            fetchTodos();
        } catch (error) {
            console.error("Toggle todo error:", error);
        }
    };

    const deleteTodo = async (id: number) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos/${id}`, {
                method: "DELETE",
            });

            fetchTodos();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-100 px-4 py-10">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-slate-800">
                        Todo List
                    </h1>
                    <p className="mt-2 text-slate-500">
                        จัดการงานที่ต้องทำของคุณ
                    </p>
                </div>

                <div className="rounded-3xl bg-white/80 p-6 shadow-xl ring-1 ring-slate-200 backdrop-blur">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") createTodo();
                            }}
                            placeholder="เพิ่มงานใหม่..."
                            className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />

                        <button
                            onClick={createTodo}
                            className="rounded-2xl bg-blue-600 px-6 py-3 font-medium text-white shadow transition hover:bg-blue-700 active:scale-95"
                        >
                            Add
                        </button>
                    </div>

                    <div className="mt-6">
                        {loading ? (
                            <div className="rounded-2xl bg-slate-100 p-6 text-center text-slate-500">
                                Loading...
                            </div>
                        ) : todos.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
                                ยังไม่มี Todo
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {todos.map((todo) => (
                                    <div
                                        key={todo.id}
                                        className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                    >
                                        <div className="min-w-0">
                                            <p
                                                className={`break-words text-lg font-medium ${
                                                    todo.isDone
                                                        ? "text-slate-400 line-through"
                                                        : "text-slate-800"
                                                }`}
                                            >
                                                {todo.title}
                                            </p>

                                            <p
                                                className={`mt-1 text-sm ${
                                                    todo.isDone
                                                        ? "text-green-600"
                                                        : "text-orange-500"
                                                }`}
                                            >
                                                {todo.isDone
                                                    ? "เสร็จแล้ว"
                                                    : "ยังไม่เสร็จ"}
                                            </p>
                                        </div>

                                        <div className="flex shrink-0 gap-2">
                                            <button
                                                onClick={() => toggleTodo(todo)}
                                                className={`rounded-xl px-4 py-2 text-sm font-medium text-white transition active:scale-95 ${
                                                    todo.isDone
                                                        ? "bg-slate-500 hover:bg-slate-600"
                                                        : "bg-green-500 hover:bg-green-600"
                                                }`}
                                            >
                                                {todo.isDone
                                                    ? "ยกเลิก"
                                                    : "เสร็จ"}
                                            </button>

                                            <button
                                                onClick={() =>
                                                    deleteTodo(todo.id)
                                                }
                                                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 active:scale-95"
                                            >
                                                ลบ
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}