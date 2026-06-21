"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useMemo, useRef, useState } from "react";

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

type DragState = {
    id: number;
    pointerId: number;
};

function moveTodo(list: Todo[], fromId: number, toId: number) {
    const fromIndex = list.findIndex((todo) => todo.id === fromId);
    const toIndex = list.findIndex((todo) => todo.id === toId);

    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
        return list;
    }

    const next = [...list];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    return next;
}

export default function TodoPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");
    const [dragState, setDragState] = useState<DragState | null>(null);
    const [dragOverId, setDragOverId] = useState<number | null>(null);
    const dragFromId = useRef<number | null>(null);

    const fetchTodos = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/todos`,
            );
            const result: TodoResponse = await res.json();

            if (result.success) {
                setTodos(result.data);
                setError("");
            }
        } catch (fetchError) {
            console.error("Fetch todos error:", fetchError);
            setError("Could not load todos. Check that the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTodos();
    }, []);

    const createTodo = async () => {
        const nextTitle = title.trim();

        if (!nextTitle) return;

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: nextTitle }),
            });

            setTitle("");
            setError("");
            fetchTodos();
        } catch (createError) {
            console.error("Create todo error:", createError);
            setError("Could not add this todo.");
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

            setError("");
            fetchTodos();
        } catch (toggleError) {
            console.error("Toggle todo error:", toggleError);
            setError("Could not update this todo.");
        }
    };

    const deleteTodo = async (id: number) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos/${id}`, {
                method: "DELETE",
            });

            setError("");
            fetchTodos();
        } catch (deleteError) {
            console.error("Delete todo error:", deleteError);
            setError("Could not delete this todo.");
        }
    };

    const startDrag = (
        event: React.PointerEvent<HTMLButtonElement>,
        id: number,
    ) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        dragFromId.current = id;
        setDragState({ id, pointerId: event.pointerId });
        setDragOverId(id);
    };

    const moveDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
        if (!dragState) return;

        const element = document.elementFromPoint(event.clientX, event.clientY);
        const todoElement = element?.closest("[data-todo-id]");
        const todoId = todoElement?.getAttribute("data-todo-id");

        if (todoId) {
            setDragOverId(Number(todoId));
        }
    };

    const endDrag = () => {
        const fromId = dragFromId.current;

        if (fromId && dragOverId && fromId !== dragOverId) {
            setTodos((current) => moveTodo(current, fromId, dragOverId));
        }

        dragFromId.current = null;
        setDragState(null);
        setDragOverId(null);
    };

    const completedCount = todos.filter((todo) => todo.isDone).length;
    const openCount = todos.length - completedCount;
    const progress = todos.length
        ? Math.round((completedCount / todos.length) * 100)
        : 0;
    const latestTodo = useMemo(() => todos[0]?.title ?? "No tasks yet", [todos]);

    return (
        <main className="animated-surface relative min-h-screen overflow-hidden px-4 py-4 text-slate-950 sm:px-6 lg:px-8">
            <div className="liquid-bg" />
            <div className="dot-bg" />

            <Navbar />

            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 py-10">
                <header className="overflow-hidden rounded-lg border border-white/80 bg-white/55 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
                    <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px] lg:p-8">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                                Slowwork Tasks
                            </p>
                            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                                Todo Board
                            </h1>
                            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                                Plan the day, mark work complete, and drag tasks
                                into the order you want. Drag ordering is kept in
                                the current browser session.
                            </p>
                        </div>

                        <div className="rounded-lg border border-white/80 bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/15">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
                                Progress
                            </p>
                            <div className="mt-4 flex items-end justify-between gap-4">
                                <p className="text-5xl font-semibold">
                                    {progress}%
                                </p>
                                <p className="pb-2 text-sm text-slate-300">
                                    {completedCount} of {todos.length} done
                                </p>
                            </div>
                            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                                <div
                                    className="h-full rounded-full bg-blue-400 transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="mt-4 truncate text-sm text-slate-300">
                                Latest: {latestTodo}
                            </p>
                        </div>
                    </div>
                </header>

                <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
                    <aside className="h-fit rounded-lg border border-white/80 bg-white/60 p-5 shadow-xl shadow-slate-900/10 backdrop-blur-xl">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                                New task
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                                Capture work
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Add a task, then reorder the list by holding the
                                drag handle on each card.
                            </p>
                        </div>

                        <div className="mt-6 grid gap-3">
                            <input
                                type="text"
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") createTodo();
                                }}
                                placeholder="Add a new task..."
                                className="h-12 w-full rounded-lg border border-white/80 bg-white/80 px-4 text-base text-slate-900 shadow-inner shadow-slate-200/60 outline-none backdrop-blur transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                            />

                            <button
                                onClick={createTodo}
                                className="h-12 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-300/70 transition hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0 active:scale-[0.98]"
                            >
                                Add task
                            </button>
                        </div>

                        {error ? (
                            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                                {error}
                            </div>
                        ) : null}

                        <div className="mt-6 grid grid-cols-3 gap-2">
                            <div className="rounded-lg border border-white/80 bg-white/70 px-3 py-3 shadow-sm backdrop-blur">
                                <p className="text-xs font-medium text-slate-500">
                                    Total
                                </p>
                                <p className="mt-1 text-2xl font-semibold">
                                    {todos.length}
                                </p>
                            </div>
                            <div className="rounded-lg border border-white/80 bg-white/70 px-3 py-3 shadow-sm backdrop-blur">
                                <p className="text-xs font-medium text-slate-500">
                                    Open
                                </p>
                                <p className="mt-1 text-2xl font-semibold text-amber-700">
                                    {openCount}
                                </p>
                            </div>
                            <div className="rounded-lg border border-white/80 bg-white/70 px-3 py-3 shadow-sm backdrop-blur">
                                <p className="text-xs font-medium text-slate-500">
                                    Done
                                </p>
                                <p className="mt-1 text-2xl font-semibold text-emerald-700">
                                    {completedCount}
                                </p>
                            </div>
                        </div>
                    </aside>

                    <section className="min-w-0 overflow-hidden rounded-lg border border-white/80 bg-white/60 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
                        <div className="flex flex-col justify-between gap-4 border-b border-white/70 bg-white/45 p-5 sm:flex-row sm:items-end sm:p-6">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                                    Task queue
                                </p>
                                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                                    Drag to prioritize
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-slate-500">
                                    Use the handle on each task. Works with mouse,
                                    trackpad, and touch.
                                </p>
                            </div>
                            <span className="rounded-full border border-white/80 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur">
                                Local reorder
                            </span>
                        </div>

                        <div className="p-4 sm:p-6">
                            {loading ? (
                                <div className="rounded-lg border border-white/80 bg-white/75 p-10 text-center text-slate-500 shadow-lg backdrop-blur-md">
                                    Loading tasks...
                                </div>
                            ) : todos.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-slate-300 bg-white/65 p-10 text-center shadow-lg backdrop-blur-md sm:p-12">
                                    <p className="text-lg font-semibold text-slate-900">
                                        No tasks yet
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        Add your first task from the panel on the
                                        left. On mobile, the form appears above the
                                        list.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {todos.map((todo, index) => {
                                        const isDragging =
                                            dragState?.id === todo.id;
                                        const isDragTarget =
                                            dragOverId === todo.id &&
                                            dragState?.id !== todo.id;

                                        return (
                                            <article
                                                key={todo.id}
                                                data-todo-id={todo.id}
                                                className={`group relative grid gap-4 rounded-lg border p-4 shadow-lg backdrop-blur-xl transition-all duration-300 ease-out sm:grid-cols-[44px_1fr_auto] sm:items-center ${
                                                    isDragging
                                                        ? "z-20 scale-[1.02] border-blue-300 bg-blue-50/90 shadow-2xl shadow-blue-200/70"
                                                        : isDragTarget
                                                          ? "translate-y-1 border-blue-300 bg-white/95 shadow-xl shadow-blue-100"
                                                          : "border-white/80 bg-white/75 hover:-translate-y-0.5 hover:border-white hover:bg-white/90 hover:shadow-xl"
                                                }`}
                                            >
                                                <button
                                                    type="button"
                                                    aria-label={`Drag task ${index + 1}`}
                                                    onPointerDown={(event) =>
                                                        startDrag(event, todo.id)
                                                    }
                                                    onPointerMove={moveDrag}
                                                    onPointerUp={endDrag}
                                                    onPointerCancel={endDrag}
                                                    className="flex h-11 w-11 touch-none select-none items-center justify-center rounded-lg border border-white/80 bg-white/80 text-sm font-bold text-slate-500 shadow-sm transition hover:bg-white hover:text-blue-600 active:scale-95 sm:cursor-grab sm:active:cursor-grabbing"
                                                >
                                                    ::
                                                </button>

                                                <button
                                                    onClick={() => toggleTodo(todo)}
                                                    className="flex min-w-0 items-start gap-3 text-left"
                                                >
                                                    <span
                                                        className={`mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition ${
                                                            todo.isDone
                                                                ? "border-emerald-600 bg-emerald-600 text-white"
                                                                : "border-slate-300 bg-white group-hover:border-blue-500"
                                                        }`}
                                                    >
                                                        {todo.isDone ? "OK" : ""}
                                                    </span>
                                                    <span className="min-w-0">
                                                        <span
                                                            className={`block break-words text-base font-semibold leading-6 ${
                                                                todo.isDone
                                                                    ? "text-slate-400 line-through"
                                                                    : "text-slate-950"
                                                            }`}
                                                        >
                                                            {todo.title}
                                                        </span>
                                                        <span
                                                            className={`mt-1 block text-sm ${
                                                                todo.isDone
                                                                    ? "text-emerald-700"
                                                                    : "text-amber-700"
                                                            }`}
                                                        >
                                                            {todo.isDone
                                                                ? "Completed"
                                                                : "In progress"}
                                                        </span>
                                                    </span>
                                                </button>

                                                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                                    <button
                                                        onClick={() =>
                                                            toggleTodo(todo)
                                                        }
                                                        className={`h-10 rounded-lg px-4 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${
                                                            todo.isDone
                                                                ? "border border-white/80 bg-white/80 text-slate-700 hover:bg-white"
                                                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                                                        }`}
                                                    >
                                                        {todo.isDone
                                                            ? "Reopen"
                                                            : "Done"}
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            deleteTodo(todo.id)
                                                        }
                                                        className="h-10 rounded-lg border border-red-200 bg-white/80 px-4 text-sm font-semibold text-red-600 shadow-sm transition hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50 active:translate-y-0 active:scale-[0.98]"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </section>
                </section>
            </div>
        </main>
    );
}
