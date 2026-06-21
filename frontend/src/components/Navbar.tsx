"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";

const navItems = [
    { href: "/", labelKey: "nav.home" },
    { href: "/dev-tools", labelKey: "nav.devTools" },
    { href: "/todos", labelKey: "nav.todos" },
];

export default function Navbar() {
    const pathname = usePathname();
    const { language, toggleLanguage, t } = useLanguage();

    return (
        <nav className="glass-nav relative z-10 mx-auto flex max-w-7xl flex-col gap-3 rounded-2xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:px-5">
            <Link href="/" className="relative z-10 flex items-center gap-3">
                <div className="flex items-center justify-center overflow-hidden">
                    <Image
                        src="/logo_new.png"
                        alt="Slowwork"
                        width={36}
                        height={36}
                        className="h-9 w-9"
                        priority
                    />
                </div>
                <span className="text-lg font-bold text-slate-900 sm:text-xl">
                    Slowwork
                </span>
            </Link>

            <div className="relative z-10 flex w-full flex-wrap items-center gap-2 text-sm font-medium text-slate-700 sm:w-auto sm:justify-end">
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
                                    ? "glass-nav-pill px-4 py-2.5 font-semibold"
                                    : "glass-nav-link"
                            }
                        >
                            {t(item.labelKey)}
                        </Link>
                    );
                })}
                <button
                    type="button"
                    onClick={toggleLanguage}
                    aria-label={t("nav.language")}
                    className="glass-nav-link font-semibold uppercase"
                >
                    {language === "en" ? "TH" : "EN"}
                </button>
            </div>
        </nav>
    );
}
