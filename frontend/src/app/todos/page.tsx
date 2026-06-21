"use client";

import Image from "next/image";
import Link from "next/link";
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
        // eslint-disable-next-line react-hooks/set-state-in-effect
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

    const completedCount = todos.filter((todo) => todo.isDone).length;
    const openCount = todos.length - completedCount;

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#fbfbfb] px-4 py-4 text-slate-950 sm:px-6 lg:px-8">
            <div className="dot-bg" />
            <div className="floating-blur floating-1" />
            <div className="floating-blur floating-2" />
            <div className="floating-blur floating-3" />

            <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/80 bg-white/85 px-5 py-4 shadow-lg backdrop-blur-md sm:px-6">
                <Link href="/" className="flex items-center gap-3">
                    <div className="flex items-center justify-center overflow-hidden">
                        <Image
                            src="/logo.png"
                            alt="Slowwork"
                            width={36}
                            height={36}
                            className="h-9 w-9"
                            priority
                        />
                    </div>
                    <span className="text-xl font-bold text-slate-900">
                        Slowwork
                    </span>
                </Link>

                <div className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
                    <Link href="/" className="transition hover:text-blue-600">
                        Home
                    </Link>
                    <Link
                        href="/todos"
                        className="rounded-full bg-blue-600 px-5 py-3 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-blue-700"
                    >
                        Get started todos for free
                    </Link>
                </div>
            </nav>

            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 py-10">
                <header className="flex flex-col justify-between gap-6 border-b border-white/70 pb-8 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-600">
                            Slowwork
                        </p>
                        <h1 className="mt-3 text-4xl font-semibold text-slate-950 sm:text-5xl">
                            Todo List
                        </h1>
                        <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
                            จัดระเบียบงานประจำวันให้เรียบง่าย เห็นชัด และจบงานได้เร็วขึ้น
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:w-80">
                        <div className="rounded-lg border border-white/80 bg-white/85 px-4 py-3 shadow-sm backdrop-blur">
                            <p className="text-xs font-medium text-slate-500">
                                ทั้งหมด
                            </p>
                            <p className="mt-1 text-2xl font-semibold">
                                {todos.length}
                            </p>
                        </div>
                        <div className="rounded-lg border border-white/80 bg-white/85 px-4 py-3 shadow-sm backdrop-blur">
                            <p className="text-xs font-medium text-slate-500">
                                รอทำ
                            </p>
                            <p className="mt-1 text-2xl font-semibold text-amber-700">
                                {openCount}
                            </p>
                        </div>
                        <div className="rounded-lg border border-white/80 bg-white/85 px-4 py-3 shadow-sm backdrop-blur">
                            <p className="text-xs font-medium text-slate-500">
                                เสร็จ
                            </p>
                            <p className="mt-1 text-2xl font-semibold text-emerald-700">
                                {completedCount}
                            </p>
                        </div>
                    </div>
                </header>

                <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
                    <aside className="h-fit rounded-lg border border-white/80 bg-white/85 p-5 shadow-lg backdrop-blur-md">
                        <div className="mb-5">
                            <h2 className="text-lg font-semibold text-slate-950">
                                เพิ่มงานใหม่
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                กด Enter หรือปุ่ม Add เพื่อบันทึกงาน
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") createTodo();
                                }}
                                placeholder="เพิ่มงานใหม่..."
                                className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                            />

                            <button
                                onClick={createTodo}
                                className="h-12 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-md shadow-blue-100 transition hover:bg-blue-700 active:scale-[0.98]"
                            >
                                Add
                            </button>
                        </div>
                    </aside>

                    <div className="min-w-0">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-950">
                                    งานทั้งหมด
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    อัปเดตสถานะหรือลบงานที่ไม่ต้องการแล้ว
                                </p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="rounded-lg border border-white/80 bg-white/85 p-10 text-center text-slate-500 shadow-lg backdrop-blur-md">
                                Loading...
                            </div>
                        ) : todos.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-slate-300 bg-white/75 p-12 text-center shadow-lg backdrop-blur-md">
                                <p className="text-lg font-semibold text-slate-900">
                                    ยังไม่มี Todo
                                </p>
                                <p className="mt-2 text-sm text-slate-500">
                                    เพิ่มงานแรกของคุณจากช่องด้านซ้าย
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {todos.map((todo) => (
                                    <div
                                        key={todo.id}
                                        className="group flex flex-col gap-4 rounded-lg border border-white/80 bg-white/85 p-4 shadow-lg backdrop-blur-md transition hover:border-blue-100 hover:shadow-xl sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <button
                                            onClick={() => toggleTodo(todo)}
                                            className="flex min-w-0 flex-1 items-start gap-3 text-left"
                                        >
                                            <span
                                                className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border transition ${
                                                    todo.isDone
                                                        ? "border-emerald-600 bg-emerald-600 text-white"
                                                        : "border-slate-300 bg-white group-hover:border-blue-500"
                                                }`}
                                            >
                                                {todo.isDone ? (
                                                    <span className="text-xs leading-none">
                                                        ✓
                                                    </span>
                                                ) : null}
                                            </span>
                                            <span className="min-w-0">
                                                <p
                                                    className={`break-words text-base font-medium leading-6 ${
                                                        todo.isDone
                                                            ? "text-slate-400 line-through"
                                                            : "text-slate-950"
                                                    }`}
                                                >
                                                    {todo.title}
                                                </p>

                                                <p
                                                    className={`mt-1 text-sm ${
                                                        todo.isDone
                                                            ? "text-emerald-700"
                                                            : "text-amber-700"
                                                    }`}
                                                >
                                                    {todo.isDone
                                                        ? "เสร็จแล้ว"
                                                        : "ยังไม่เสร็จ"}
                                                </p>
                                            </span>
                                        </button>

                                        <div className="flex shrink-0 items-center gap-2 sm:justify-end">
                                            <button
                                                onClick={() => toggleTodo(todo)}
                                                className={`h-10 rounded-lg px-4 text-sm font-semibold transition active:scale-[0.98] ${
                                                    todo.isDone
                                                        ? "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                                        : "bg-emerald-600 text-white hover:bg-emerald-700"
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
                                                className="h-10 rounded-lg border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 active:scale-[0.98]"
                                            >
                                                ลบ
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <style jsx>{`
                .dot-bg {
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(
                        rgba(15, 23, 42, 0.13) 1px,
                        transparent 1px
                    );
                    background-size: 22px 22px;
                    animation: dotMove 7s linear infinite;
                    opacity: 0.55;
                }

                .floating-blur {
                    position: absolute;
                    border-radius: 9999px;
                    filter: blur(70px);
                    animation: floatMove 5s ease-in-out infinite alternate;
                }

                .floating-1 {
                    width: 280px;
                    height: 280px;
                    top: 18%;
                    left: 10%;
                    background: rgba(96, 165, 250, 0.45);
                }

                .floating-2 {
                    width: 340px;
                    height: 340px;
                    right: 8%;
                    bottom: 14%;
                    background: rgba(216, 180, 254, 0.5);
                    animation-duration: 6s;
                }

                .floating-3 {
                    width: 240px;
                    height: 240px;
                    right: 35%;
                    top: 22%;
                    background: rgba(244, 114, 182, 0.28);
                    animation-duration: 4.5s;
                }

                @keyframes dotMove {
                    from {
                        background-position: 0 0;
                    }
                    to {
                        background-position: 44px 44px;
                    }
                }

                @keyframes floatMove {
                    from {
                        transform: translateY(0) translateX(0) scale(1);
                    }
                    to {
                        transform: translateY(35px) translateX(28px) scale(1.06);
                    }
                }
            `}</style>
        </main>
    );
}
