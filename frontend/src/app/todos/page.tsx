"use client";

import Navbar from "@/components/Navbar";
import { useLanguage } from "@/components/LanguageProvider";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

type KanbanStatus = "todo" | "doing" | "done";

const STATUS_STORAGE_KEY = "slowwork-todo-status";

function readStoredStatuses() {
    if (typeof window === "undefined") return {};

    const saved = window.localStorage.getItem(STATUS_STORAGE_KEY);

    if (!saved) return {};

    try {
        const parsed = JSON.parse(saved) as Record<string, KanbanStatus>;
        const next: Record<number, KanbanStatus> = {};

        Object.entries(parsed).forEach(([id, status]) => {
            if (status === "todo" || status === "doing") {
                next[Number(id)] = status;
            }
        });

        return next;
    } catch (storageError) {
        console.error("Read todo status error:", storageError);
        return {};
    }
}

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
    const { t } = useLanguage();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");
    const [statusById, setStatusById] =
        useState<Record<number, KanbanStatus>>(readStoredStatuses);
    const [dragState, setDragState] = useState<DragState | null>(null);
    const [dragOverId, setDragOverId] = useState<number | null>(null);
    const [dragOverStatus, setDragOverStatus] = useState<KanbanStatus | null>(
        null,
    );
    const dragFromId = useRef<number | null>(null);

    const getStatus = (todo: Todo): KanbanStatus => {
        if (todo.isDone) return "done";
        return statusById[todo.id] ?? "todo";
    };

    const fetchTodos = useCallback(async () => {
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
            setError(t("todos.loadError"));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTodos();
    }, [fetchTodos]);

    useEffect(() => {
        window.localStorage.setItem(
            STATUS_STORAGE_KEY,
            JSON.stringify(statusById),
        );
    }, [statusById]);

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
            setError(t("todos.addError"));
        }
    };

    const persistDoneState = async (todo: Todo, nextIsDone: boolean) => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos/${todo.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isDone: nextIsDone }),
        });
    };

    const setTodoStatus = async (todo: Todo, status: KanbanStatus) => {
        const nextIsDone = status === "done";

        setTodos((current) =>
            current.map((item) =>
                item.id === todo.id ? { ...item, isDone: nextIsDone } : item,
            ),
        );
        setStatusById((current) => ({
            ...current,
            [todo.id]: status,
        }));

        try {
            if (todo.isDone !== nextIsDone) {
                await persistDoneState(todo, nextIsDone);
                fetchTodos();
            }
            setError("");
        } catch (toggleError) {
            console.error("Update todo status error:", toggleError);
            setError(t("todos.updateError"));
            fetchTodos();
        }
    };

    const deleteTodo = async (id: number) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos/${id}`, {
                method: "DELETE",
            });

            setStatusById((current) => {
                const next = { ...current };
                delete next[id];
                return next;
            });
            setError("");
            fetchTodos();
        } catch (deleteError) {
            console.error("Delete todo error:", deleteError);
            setError(t("todos.deleteError"));
        }
    };

    const startDrag = (
        event: React.PointerEvent<HTMLButtonElement>,
        id: number,
    ) => {
        const todo = todos.find((item) => item.id === id);

        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        dragFromId.current = id;
        setDragState({ id, pointerId: event.pointerId });
        setDragOverId(id);
        setDragOverStatus(todo ? getStatus(todo) : "todo");
    };

    const moveDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
        if (!dragState) return;

        const element = document.elementFromPoint(event.clientX, event.clientY);
        const todoElement = element?.closest("[data-todo-id]");
        const statusElement = element?.closest("[data-kanban-status]");
        const todoId = todoElement?.getAttribute("data-todo-id");
        const status = statusElement?.getAttribute(
            "data-kanban-status",
        ) as KanbanStatus | null;

        if (todoId) setDragOverId(Number(todoId));
        if (status === "todo" || status === "doing" || status === "done") {
            setDragOverStatus(status);
        }
    };

    const endDrag = () => {
        const fromId = dragFromId.current;
        const draggedTodo = todos.find((todo) => todo.id === fromId);

        if (fromId && draggedTodo && dragOverStatus) {
            const currentStatus = getStatus(draggedTodo);

            if (currentStatus !== dragOverStatus) {
                setTodoStatus(draggedTodo, dragOverStatus);
            } else if (dragOverId && fromId !== dragOverId) {
                setTodos((current) => moveTodo(current, fromId, dragOverId));
            }
        }

        dragFromId.current = null;
        setDragState(null);
        setDragOverId(null);
        setDragOverStatus(null);
    };

    const groupedTodos = useMemo(() => {
        const grouped: Record<KanbanStatus, Todo[]> = {
            todo: [],
            doing: [],
            done: [],
        };

        todos.forEach((todo) => {
            const status = todo.isDone
                ? "done"
                : statusById[todo.id] ?? "todo";
            grouped[status].push(todo);
        });

        return grouped;
    }, [statusById, todos]);

    const progress = todos.length
        ? Math.round((groupedTodos.done.length / todos.length) * 100)
        : 0;

    const columns: Array<{
        status: KanbanStatus;
        title: string;
        caption: string;
        tone: string;
        todos: Todo[];
    }> = [
        {
            status: "todo",
            title: "Todo",
            caption: t("todos.todoCaption"),
            tone: "bg-sky-500",
            todos: groupedTodos.todo,
        },
        {
            status: "doing",
            title: "Doing",
            caption: t("todos.doingCaption"),
            tone: "bg-amber-500",
            todos: groupedTodos.doing,
        },
        {
            status: "done",
            title: "Done",
            caption: t("todos.doneCaption"),
            tone: "bg-emerald-500",
            todos: groupedTodos.done,
        },
    ];

    return (
        <main className="animated-surface relative min-h-screen overflow-hidden px-3 py-3 text-slate-950 sm:px-5 sm:py-4 lg:px-7">
            <div className="liquid-bg" />
            <div className="dot-bg" />

            <Navbar />

            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-4 py-6 sm:py-8">
                <section className="grid overflow-hidden rounded-lg border border-white/80 bg-white/45 shadow-xl shadow-slate-900/10 backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="bg-slate-950 p-5 text-white sm:p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                            {t("todos.eyebrow")}
                        </p>
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                            {t("todos.title")}
                        </h1>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                            {t("todos.copy")}
                        </p>

                        <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_96px]">
                            <input
                                type="text"
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") createTodo();
                                }}
                                placeholder={t("todos.input")}
                                className="h-11 w-full rounded-lg border border-white/15 bg-white/10 px-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white/15 focus:ring-4 focus:ring-blue-300/10"
                            />
                            <button
                                onClick={createTodo}
                                className="h-11 rounded-lg bg-white px-4 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-blue-50 active:translate-y-0 active:scale-[0.98]"
                            >
                                {t("todos.add")}
                            </button>
                        </div>

                        {error ? (
                            <div className="mt-3 rounded-lg border border-red-300/30 bg-red-400/10 px-3 py-2 text-sm leading-6 text-red-100">
                                {error}
                            </div>
                        ) : null}
                    </div>

                    <div className="grid gap-3 p-5 sm:grid-cols-4 sm:p-6">
                        {[
                            [t("todos.total"), todos.length, "text-slate-950"],
                            [t("todos.todo"), groupedTodos.todo.length, "text-sky-700"],
                            [t("todos.doing"), groupedTodos.doing.length, "text-amber-700"],
                            [t("todos.done"), groupedTodos.done.length, "text-emerald-700"],
                        ].map(([label, value, color]) => (
                            <div
                                key={label}
                                className="rounded-lg border border-white/80 bg-white/70 p-3 shadow-sm backdrop-blur"
                            >
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                    {label}
                                </p>
                                <p
                                    className={`mt-1 text-2xl font-semibold ${color}`}
                                >
                                    {value}
                                </p>
                            </div>
                        ))}
                        <div className="sm:col-span-4">
                            <div className="flex items-center justify-between gap-4 text-sm font-medium text-slate-600">
                                <span>{t("todos.progress")}</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/80">
                                <div
                                    className="h-full rounded-full bg-slate-950 transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {loading ? (
                    <div className="rounded-lg border border-white/80 bg-white/70 p-8 text-center text-slate-500 shadow-lg backdrop-blur-md">
                        {t("todos.loading")}
                    </div>
                ) : (
                    <section className="grid gap-4 lg:grid-cols-3">
                        {columns.map((column) => {
                            const isColumnTarget =
                                dragOverStatus === column.status && dragState;

                            return (
                                <div
                                    key={column.status}
                                    data-kanban-status={column.status}
                                    className={`min-h-[340px] rounded-lg border shadow-xl shadow-slate-900/10 backdrop-blur-xl transition-all duration-300 ${
                                        isColumnTarget
                                            ? "border-blue-300 bg-blue-50/70"
                                            : "border-white/80 bg-white/50"
                                    }`}
                                >
                                    <div className="border-b border-white/70 p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div
                                                    className={`mb-2 h-1.5 w-14 rounded-full ${column.tone}`}
                                                />
                                                <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                                                    {t(
                                                        column.status === "done"
                                                            ? "todos.done"
                                                            : column.status ===
                                                                "doing"
                                                              ? "todos.doing"
                                                              : "todos.todo",
                                                    )}
                                                </h2>
                                                <p className="mt-1 text-sm leading-5 text-slate-500">
                                                    {column.caption}
                                                </p>
                                            </div>
                                            <span className="rounded-full border border-white/80 bg-white/75 px-3 py-1 text-sm font-semibold text-slate-600 shadow-sm">
                                                {column.todos.length}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-3">
                                        {column.todos.length === 0 ? (
                                            <div className="flex min-h-44 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/35 p-5 text-center">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-700">
                                                        {t("todos.noCards")}
                                                    </p>
                                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                                        {t("todos.drop")}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid gap-2.5">
                                                {column.todos.map(
                                                    (todo, index) => {
                                                        const isDragging =
                                                            dragState?.id ===
                                                            todo.id;
                                                        const isDragTarget =
                                                            dragOverId ===
                                                                todo.id &&
                                                            dragState?.id !==
                                                                todo.id;
                                                        const status =
                                                            getStatus(todo);

                                                        return (
                                                            <article
                                                                key={todo.id}
                                                                data-todo-id={
                                                                    todo.id
                                                                }
                                                                className={`group rounded-lg border bg-white/80 shadow-sm backdrop-blur-xl transition-all duration-300 ease-out ${
                                                                    isDragging
                                                                        ? "z-20 scale-[1.02] border-blue-300 shadow-2xl shadow-blue-200/70"
                                                                        : isDragTarget
                                                                          ? "translate-y-1 border-blue-300 shadow-xl shadow-blue-100"
                                                                          : "border-white/85 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
                                                                }`}
                                                            >
                                                                <div className="grid grid-cols-[auto_1fr] gap-3 p-3">
                                                                    <button
                                                                        type="button"
                                                                        aria-label={`Drag ${todo.title}`}
                                                                        onPointerDown={(
                                                                            event,
                                                                        ) =>
                                                                            startDrag(
                                                                                event,
                                                                                todo.id,
                                                                            )
                                                                        }
                                                                        onPointerMove={
                                                                            moveDrag
                                                                        }
                                                                        onPointerUp={
                                                                            endDrag
                                                                        }
                                                                        onPointerCancel={
                                                                            endDrag
                                                                        }
                                                                        className="flex h-9 w-9 touch-none select-none items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm font-bold text-slate-400 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 active:scale-95 sm:cursor-grab sm:active:cursor-grabbing"
                                                                    >
                                                                        ::
                                                                    </button>

                                                                    <button
                                                                        onClick={() =>
                                                                            setTodoStatus(
                                                                                todo,
                                                                                status ===
                                                                                    "done"
                                                                                    ? "todo"
                                                                                    : "done",
                                                                            )
                                                                        }
                                                                        className="min-w-0 text-left"
                                                                    >
                                                                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                                                            {String(
                                                                                index +
                                                                                    1,
                                                                            ).padStart(
                                                                                2,
                                                                                "0",
                                                                            )}
                                                                        </span>
                                                                        <span
                                                                            className={`mt-1.5 block break-words text-sm font-semibold leading-6 ${
                                                                                todo.isDone
                                                                                    ? "text-slate-500 line-through"
                                                                                    : "text-slate-950"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                todo.title
                                                                            }
                                                                        </span>
                                                                    </button>
                                                                </div>

                                                                <div className="flex flex-col gap-2 border-t border-slate-100 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                                                                    <span
                                                                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                                                            status ===
                                                                            "done"
                                                                                ? "bg-emerald-50 text-emerald-700"
                                                                                : status ===
                                                                                    "doing"
                                                                                  ? "bg-amber-50 text-amber-700"
                                                                                  : "bg-sky-50 text-sky-700"
                                                                        }`}
                                                                    >
                                                                            {t(
                                                                                status ===
                                                                                    "done"
                                                                                    ? "todos.done"
                                                                                    : status ===
                                                                                        "doing"
                                                                                      ? "todos.doing"
                                                                                      : "todos.todo",
                                                                            )}
                                                                    </span>
                                                                    <div className="flex flex-wrap gap-1.5 sm:justify-end">
                                                                        <button
                                                                            onClick={() =>
                                                                                setTodoStatus(
                                                                                    todo,
                                                                                    status ===
                                                                                        "doing"
                                                                                        ? "todo"
                                                                                        : "doing",
                                                                                )
                                                                            }
                                                                            className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 transition hover:border-amber-200 hover:text-amber-700 active:scale-[0.98]"
                                                                        >
                                                                            {t("todos.doing")}
                                                                        </button>
                                                                        <button
                                                                            onClick={() =>
                                                                                setTodoStatus(
                                                                                    todo,
                                                                                    status ===
                                                                                        "done"
                                                                                        ? "todo"
                                                                                        : "done",
                                                                                )
                                                                            }
                                                                            className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700 active:scale-[0.98]"
                                                                        >
                                                                            {status ===
                                                                            "done"
                                                                                ? t("todos.reopen")
                                                                                : t("todos.done")}
                                                                        </button>
                                                                        <button
                                                                            onClick={() =>
                                                                                deleteTodo(
                                                                                    todo.id,
                                                                                )
                                                                            }
                                                                            className="h-8 rounded-lg border border-red-100 bg-white px-2.5 text-xs font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50 active:scale-[0.98]"
                                                                        >
                                                                            {t("todos.delete")}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </article>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                )}
            </div>
        </main>
    );
}
