import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "JSON Formatter",
};

export default function JsonFormatterLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
