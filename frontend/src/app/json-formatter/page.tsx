"use client";

import Navbar from "@/components/Navbar";
import { useLanguage } from "@/components/LanguageProvider";
import { useMemo, useState } from "react";

const sampleJson = `{
    "project": "Slowwork",
    "feature": "JSON Formatter",
    "enabled": true,
    "tools": ["format", "minify", "validate"],
    "settings": {
        "indent": 4,
        "theme": "clean"
    }
}`;

export default function JsonFormatterPage() {
    const { t } = useLanguage();
    const [input, setInput] = useState(sampleJson);
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const inputStats = useMemo(() => {
        const lines = input ? input.split(/\r\n|\r|\n/).length : 0;
        return {
            lines,
            characters: input.length,
        };
    }, [input]);

    const outputStats = useMemo(() => {
        const lines = output ? output.split(/\r\n|\r|\n/).length : 0;
        return {
            lines,
            characters: output.length,
        };
    }, [output]);

    const formatJson = () => {
        try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed, null, 4));
            setError("");
            setCopied(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Invalid JSON");
            setOutput("");
            setCopied(false);
        }
    };

    const minifyJson = () => {
        try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed));
            setError("");
            setCopied(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Invalid JSON");
            setOutput("");
            setCopied(false);
        }
    };

    const copyOutput = async () => {
        if (!output) return;

        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Copy failed");
        }
    };

    const clearAll = () => {
        setInput("");
        setOutput("");
        setError("");
        setCopied(false);
    };

    const loadSample = () => {
        setInput(sampleJson);
        setOutput("");
        setError("");
        setCopied(false);
    };

    return (
        <main className="animated-surface relative min-h-screen overflow-hidden px-4 py-4 text-slate-950 sm:px-6 lg:px-8">
            <div className="liquid-bg" />
            <div className="dot-bg" />

            <Navbar />

            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 py-8">
                <header className="flex flex-col justify-between gap-5 border-b border-white/70 pb-6 lg:flex-row lg:items-end">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-600">
                            {t("json.eyebrow")}
                        </p>
                        <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
                            {t("json.title")}
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                            {t("json.copy")}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:w-80">
                        <div className="rounded-lg border border-white/80 bg-white/85 px-4 py-3 shadow-sm backdrop-blur">
                            <p className="text-xs font-medium text-slate-500">
                                {t("json.inputLines")}
                            </p>
                            <p className="mt-1 text-2xl font-semibold">
                                {inputStats.lines}
                            </p>
                        </div>
                        <div className="rounded-lg border border-white/80 bg-white/85 px-4 py-3 shadow-sm backdrop-blur">
                            <p className="text-xs font-medium text-slate-500">
                                {t("json.outputChars")}
                            </p>
                            <p className="mt-1 text-2xl font-semibold text-blue-700">
                                {outputStats.characters}
                            </p>
                        </div>
                    </div>
                </header>

                <section className="grid gap-5 xl:grid-cols-[1fr_300px_1fr]">
                    <div className="min-w-0 rounded-lg border border-white/80 bg-white/85 p-4 shadow-lg backdrop-blur-md">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-950">
                                    {t("json.input")}
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    {inputStats.characters} {t("json.characters")}
                                </p>
                            </div>
                            <button
                                onClick={loadSample}
                                className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
                            >
                                {t("json.sample")}
                            </button>
                        </div>

                        <textarea
                            value={input}
                            onChange={(event) => {
                                setInput(event.target.value);
                                setError("");
                                setCopied(false);
                            }}
                            spellCheck={false}
                            placeholder='{"name":"Slowwork"}'
                            className="min-h-[360px] w-full resize-y rounded-lg border border-slate-300 bg-white p-4 font-mono text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        />
                    </div>

                    <aside className="h-fit rounded-lg border border-white/80 bg-white/85 p-4 shadow-lg backdrop-blur-md">
                        <h2 className="text-lg font-semibold text-slate-950">
                            {t("json.actions")}
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            {t("json.actionsCopy")}
                        </p>

                        <div className="mt-5 grid gap-3">
                            <button
                                onClick={formatJson}
                                className="h-11 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-md shadow-blue-100 transition hover:bg-blue-700 active:scale-[0.98]"
                            >
                                {t("json.format")}
                            </button>
                            <button
                                onClick={minifyJson}
                                className="h-11 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 active:scale-[0.98]"
                            >
                                {t("json.minify")}
                            </button>
                            <button
                                onClick={copyOutput}
                                disabled={!output}
                                className="h-11 rounded-lg border border-emerald-200 bg-white px-5 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:hover:bg-white"
                            >
                                {copied ? t("json.copied") : t("json.copyOutput")}
                            </button>
                            <button
                                onClick={clearAll}
                                className="h-11 rounded-lg border border-red-200 bg-white px-5 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 active:scale-[0.98]"
                            >
                                {t("json.clear")}
                            </button>
                        </div>

                        {error ? (
                            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                                {error}
                            </div>
                        ) : (
                            <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
                                {t("json.ready")}
                            </div>
                        )}
                    </aside>

                    <div className="min-w-0 rounded-lg border border-white/80 bg-white/85 p-4 shadow-lg backdrop-blur-md">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-950">
                                    {t("json.output")}
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    {outputStats.lines} {t("json.lines")}
                                </p>
                            </div>
                        </div>

                        <pre className="min-h-[360px] overflow-auto rounded-lg border border-slate-300 bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100">
                            {output || t("json.placeholder")}
                        </pre>
                    </div>
                </section>
            </div>
        </main>
    );
}
