"use client";

export default function Home() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-white via-sky-50 to-blue-100 px-6">
            <div className="wave wave-1" />
            <div className="wave wave-2" />
            <div className="wave wave-3" />

            <section className="relative z-10 max-w-4xl text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-5 py-2 text-sm font-semibold text-blue-600 shadow-sm backdrop-blur">
                    ✦ WELCOME
                </div>

                <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 md:text-7xl">
                    Welcome to
                    <span className="block bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
                        Playground
                    </span>
                </h1>

                <div className="mx-auto my-8 h-1 w-24 rounded-full bg-gradient-to-r from-blue-400 to-sky-300" />

                <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                    ยินดีต้อนรับสู่ Playground
                    พื้นที่สำหรับทดลอง พัฒนา และสร้างสรรค์ไอเดียใหม่ ๆ
                    ด้วย Next.js, TypeScript และเทคโนโลยีสมัยใหม่
                </p>

                <button className="mt-10 rounded-2xl bg-white/80 px-8 py-4 font-semibold text-blue-600 shadow-lg shadow-blue-100 backdrop-blur transition hover:-translate-y-1 hover:bg-white hover:shadow-xl">
                    🚀 Let&apos;s Build Something Amazing
                </button>
            </section>

            <style jsx>{`
                .wave {
                    position: absolute;
                    left: -10%;
                    width: 120%;
                    height: 320px;
                    border-radius: 45%;
                    background: linear-gradient(
                        90deg,
                        rgba(219, 234, 254, 0.45),
                        rgba(186, 230, 253, 0.28),
                        rgba(255, 255, 255, 0.6)
                    );
                    filter: blur(1px);
                    animation: waveMove 12s ease-in-out infinite alternate;
                }

                .wave-1 {
                    top: 12%;
                    transform: rotate(-6deg);
                }

                .wave-2 {
                    bottom: 18%;
                    animation-duration: 15s;
                    transform: rotate(5deg);
                }

                .wave-3 {
                    bottom: -6%;
                    animation-duration: 18s;
                    opacity: 0.8;
                    transform: rotate(-4deg);
                }

                @keyframes waveMove {
                    0% {
                        transform: translateX(-40px) translateY(0) rotate(-5deg);
                    }
                    100% {
                        transform: translateX(40px) translateY(25px) rotate(5deg);
                    }
                }
            `}</style>
        </main>
    );
}