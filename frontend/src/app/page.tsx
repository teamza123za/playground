"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/components/LanguageProvider";

export default function Home() {
    const { t } = useLanguage();

    return (
        <main className="animated-surface relative min-h-screen overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
            <div className="liquid-bg" />
            <div className="dot-bg" />

            <Navbar />

            <section className="relative z-10 mx-auto flex min-h-[calc(100vh-132px)] max-w-5xl flex-col items-center justify-center py-12 text-center sm:min-h-[calc(100vh-96px)]">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-blue-600 shadow-sm ring-1 ring-slate-200 backdrop-blur sm:text-sm">
                    {t("home.badge")}
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                    {t("home.titleA")}
                    <span className="block bg-gradient-to-r from-blue-600 via-violet-500 to-pink-500 bg-clip-text text-transparent">
                        Slowwork
                    </span>
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                    {t("home.copy")}
                </p>

                <Link
                    href="/todos"
                    className="mt-8 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-100 transition hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl sm:px-7 sm:py-3.5"
                >
                    {t("home.cta")}
                </Link>
            </section>
        </main>
    );
}
