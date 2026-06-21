"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/", label: "Home" },
    { href: "/dev-tools", label: "Dev Tools" },
    { href: "/todos", label: "Todos" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="glass-nav relative z-10 mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-4 sm:px-6">
            <Link href="/" className="relative z-10 flex items-center gap-3">
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

            <div className="relative z-10 hidden items-center gap-2 text-sm font-medium text-slate-700 md:flex">
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={
                                isActive
                                    ? "glass-nav-pill px-5 py-3 font-semibold"
                                    : "glass-nav-link"
                            }
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
