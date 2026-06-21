"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
    return (
        <main className="animated-surface relative min-h-screen overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
            <div className="liquid-bg" />
            <div className="dot-bg" />

            <Navbar />

            <section className="relative z-10 mx-auto flex min-h-[calc(100vh-96px)] max-w-5xl flex-col items-center justify-center text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-2 text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-slate-200 backdrop-blur">
                    ✦ WELCOME
                </div>

                <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 md:text-7xl">
                    Build better with
                    <span className="block bg-gradient-to-r from-blue-600 via-violet-500 to-pink-500 bg-clip-text text-transparent">
                        Slowwork
                    </span>
                </h1>

                <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                    A simple playground for learning, building, and testing ideas
                    with Next.js, TypeScript, Express, Prisma, and modern web tools.
                </p>

                <Link
                    href="/todos"
                    className="mt-10 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-100 transition hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl"
                >
                    🚀 Start building now
                </Link>
            </section>
        </main>
    );
}
