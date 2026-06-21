import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kanban Todos",
};

export default function TodosLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
