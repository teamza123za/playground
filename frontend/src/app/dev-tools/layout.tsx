import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dev Tools",
};

export default function DevToolsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
