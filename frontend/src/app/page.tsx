"use client";

export default function Home() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#fbfbfb] px-6">
            <div className="dot-bg" />
            <div className="floating-blur floating-1" />
            <div className="floating-blur floating-2" />
            <div className="floating-blur floating-3" />

            <nav className="relative z-10 mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-full border border-white/80 bg-white/85 px-6 py-4 shadow-lg backdrop-blur-md">
                <a href="/" className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white shadow">
                        <span className="text-lg font-bold">S</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900">
                        Slowwork
                    </span>
                </a>

                <div className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
                    <a href="/" className="transition hover:text-blue-600">
                        Home
                    </a>
                    {/* <a href="/todos" className="transition hover:text-blue-600">
                        Todos
                    </a> */}

                    <a
                        href="/todos"
                        className="rounded-full bg-blue-600 px-5 py-3 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-blue-700"
                    >
                        Get started todos for free
                    </a>
                </div>
            </nav>

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

                <a
                    href="/todos"
                    className="mt-10 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-100 transition hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl"
                >
                    🚀 Start building now
                </a>
            </section>

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