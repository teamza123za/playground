"use client";

import Navbar from "@/components/Navbar";
import { useLanguage } from "@/components/LanguageProvider";
import { useMemo, useState } from "react";

type ToolId =
    | "json"
    | "url"
    | "base64"
    | "uuid"
    | "timestamp"
    | "color"
    | "regex"
    | "hash"
    | "jwt"
    | "case";

type Tool = {
    id: ToolId;
    nameKey: string;
    descriptionKey: string;
    category: string;
    shortcut: string;
};

const tools: Tool[] = [
    {
        id: "json",
        nameKey: "tool.json.name",
        descriptionKey: "tool.json.desc",
        category: "Data",
        shortcut: "JS",
    },
    {
        id: "url",
        nameKey: "tool.url.name",
        descriptionKey: "tool.url.desc",
        category: "Web",
        shortcut: "URL",
    },
    {
        id: "base64",
        nameKey: "tool.base64.name",
        descriptionKey: "tool.base64.desc",
        category: "Encode",
        shortcut: "B64",
    },
    {
        id: "uuid",
        nameKey: "tool.uuid.name",
        descriptionKey: "tool.uuid.desc",
        category: "Generate",
        shortcut: "ID",
    },
    {
        id: "timestamp",
        nameKey: "tool.timestamp.name",
        descriptionKey: "tool.timestamp.desc",
        category: "Time",
        shortcut: "TS",
    },
    {
        id: "color",
        nameKey: "tool.color.name",
        descriptionKey: "tool.color.desc",
        category: "Design",
        shortcut: "HEX",
    },
    {
        id: "regex",
        nameKey: "tool.regex.name",
        descriptionKey: "tool.regex.desc",
        category: "Debug",
        shortcut: "RX",
    },
    {
        id: "hash",
        nameKey: "tool.hash.name",
        descriptionKey: "tool.hash.desc",
        category: "Crypto",
        shortcut: "SHA",
    },
    {
        id: "jwt",
        nameKey: "tool.jwt.name",
        descriptionKey: "tool.jwt.desc",
        category: "Auth",
        shortcut: "JWT",
    },
    {
        id: "case",
        nameKey: "tool.case.name",
        descriptionKey: "tool.case.desc",
        category: "Text",
        shortcut: "Aa",
    },
];

const sampleJson = `{"name":"Slowwork","stack":["Next.js","Express","Prisma"],"ready":true}`;

function decodeBase64Url(value: string) {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (padded.length % 4)) % 4);
    return atob(padded + padding);
}

function toWords(value: string) {
    return value
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[^a-zA-Z0-9]+/g, " ")
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);
}

function toTitleCase(value: string) {
    return toWords(value)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function toCamelCase(value: string) {
    const words = toWords(value);
    return words
        .map((word, index) =>
            index === 0
                ? word
                : word.charAt(0).toUpperCase() + word.slice(1),
        )
        .join("");
}

function toPascalCase(value: string) {
    return toWords(value)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
}

function toKebabCase(value: string) {
    return toWords(value).join("-");
}

function toSnakeCase(value: string) {
    return toWords(value).join("_");
}

function bytesToHex(buffer: ArrayBuffer) {
    return Array.from(new Uint8Array(buffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

function hexToColor(hexInput: string) {
    const normalized = hexInput.trim().replace(/^#/, "");
    const hex =
        normalized.length === 3
            ? normalized
                  .split("")
                  .map((char) => char + char)
                  .join("")
            : normalized;

    if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
        throw new Error("Use a valid HEX color, for example #2563eb.");
    }

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const rUnit = r / 255;
    const gUnit = g / 255;
    const bUnit = b / 255;
    const max = Math.max(rUnit, gUnit, bUnit);
    const min = Math.min(rUnit, gUnit, bUnit);
    const lightness = (max + min) / 2;
    const delta = max - min;
    let hue = 0;
    let saturation = 0;

    if (delta !== 0) {
        saturation =
            lightness > 0.5
                ? delta / (2 - max - min)
                : delta / (max + min);

        if (max === rUnit) {
            hue = (gUnit - bUnit) / delta + (gUnit < bUnit ? 6 : 0);
        } else if (max === gUnit) {
            hue = (bUnit - rUnit) / delta + 2;
        } else {
            hue = (rUnit - gUnit) / delta + 4;
        }

        hue *= 60;
    }

    return {
        hex: `#${hex.toUpperCase()}`,
        rgb: `rgb(${r}, ${g}, ${b})`,
        hsl: `hsl(${Math.round(hue)}, ${Math.round(
            saturation * 100,
        )}%, ${Math.round(lightness * 100)}%)`,
    };
}

function Field({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <label className="grid gap-2">
            <span className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-800">
                    {label}
                </span>
                {hint ? (
                    <span className="text-xs font-medium text-slate-500">
                        {hint}
                    </span>
                ) : null}
            </span>
            {children}
        </label>
    );
}

function TextArea({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    return (
        <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            spellCheck={false}
            className="min-h-44 w-full resize-y rounded-lg border border-white/70 bg-white/75 p-4 font-mono text-sm leading-6 text-slate-900 shadow-inner shadow-slate-200/60 outline-none backdrop-blur transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white/90 focus:ring-4 focus:ring-blue-100"
        />
    );
}

function Input({
    value,
    onChange,
    placeholder,
    type = "text",
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
}) {
    return (
        <input
            type={type}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="h-12 w-full rounded-lg border border-white/70 bg-white/75 px-4 text-sm text-slate-900 shadow-inner shadow-slate-200/50 outline-none backdrop-blur transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white/90 focus:ring-4 focus:ring-blue-100"
        />
    );
}

function Button({
    children,
    onClick,
    variant = "primary",
}: {
    children: React.ReactNode;
    onClick: () => void;
    variant?: "primary" | "ghost";
}) {
    return (
        <button
            onClick={onClick}
            className={`h-11 rounded-lg px-4 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${
                variant === "primary"
                    ? "bg-slate-950 text-white shadow-slate-300/60 hover:bg-blue-700"
                    : "border border-white/80 bg-white/65 text-slate-700 backdrop-blur hover:bg-white/90"
            }`}
        >
            {children}
        </button>
    );
}

function Output({ value, label = "Result" }: { value: string; label?: string }) {
    const { t } = useLanguage();

    return (
        <div className="overflow-hidden rounded-lg border border-slate-900/10 bg-slate-950 shadow-xl shadow-slate-950/10">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {label === "Result" ? t("dev.result") : label}
                </span>
                <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                    {t("dev.browserOnly")}
                </span>
            </div>
            <pre className="min-h-40 overflow-auto whitespace-pre-wrap p-4 font-mono text-sm leading-6 text-slate-100">
                {value || t("dev.outputPlaceholder")}
            </pre>
        </div>
    );
}

export default function DevToolsPage() {
    const { t } = useLanguage();
    const [activeTool, setActiveTool] = useState<ToolId>("json");
    const [jsonInput, setJsonInput] = useState(sampleJson);
    const [jsonOutput, setJsonOutput] = useState("");
    const [urlInput, setUrlInput] = useState("name=Slowwork&mode=dev tools");
    const [urlOutput, setUrlOutput] = useState("");
    const [baseInput, setBaseInput] = useState("Slowwork developer tools");
    const [baseOutput, setBaseOutput] = useState("");
    const [uuids, setUuids] = useState<string[]>([]);
    const [timestampInput, setTimestampInput] = useState(() =>
        Math.floor(Date.now() / 1000).toString(),
    );
    const [timestampOutput, setTimestampOutput] = useState("");
    const [colorInput, setColorInput] = useState("#2563eb");
    const [colorOutput, setColorOutput] = useState("");
    const [regexPattern, setRegexPattern] = useState("\\bdev\\b");
    const [regexFlags, setRegexFlags] = useState("gi");
    const [regexText, setRegexText] = useState(
        "Slowwork dev tools help developers move faster.",
    );
    const [regexOutput, setRegexOutput] = useState("");
    const [hashInput, setHashInput] = useState("Slowwork");
    const [hashOutput, setHashOutput] = useState("");
    const [jwtInput, setJwtInput] = useState("");
    const [jwtOutput, setJwtOutput] = useState("");
    const [caseInput, setCaseInput] = useState("Slowwork developer tools");

    const active = tools.find((tool) => tool.id === activeTool) ?? tools[0];
    const caseOutput = useMemo(
        () =>
            [
                `camelCase: ${toCamelCase(caseInput)}`,
                `PascalCase: ${toPascalCase(caseInput)}`,
                `kebab-case: ${toKebabCase(caseInput)}`,
                `snake_case: ${toSnakeCase(caseInput)}`,
                `Title Case: ${toTitleCase(caseInput)}`,
                `UPPER CASE: ${caseInput.toUpperCase()}`,
                `lower case: ${caseInput.toLowerCase()}`,
            ].join("\n"),
        [caseInput],
    );

    const formatJson = () => {
        try {
            setJsonOutput(JSON.stringify(JSON.parse(jsonInput), null, 4));
        } catch (error) {
            setJsonOutput(error instanceof Error ? error.message : "Invalid JSON");
        }
    };

    const minifyJson = () => {
        try {
            setJsonOutput(JSON.stringify(JSON.parse(jsonInput)));
        } catch (error) {
            setJsonOutput(error instanceof Error ? error.message : "Invalid JSON");
        }
    };

    const encodeUrl = () => setUrlOutput(encodeURIComponent(urlInput));
    const decodeUrl = () => {
        try {
            setUrlOutput(decodeURIComponent(urlInput));
        } catch (error) {
            setUrlOutput(error instanceof Error ? error.message : "Invalid URL");
        }
    };

    const encodeBase64 = () => setBaseOutput(btoa(unescape(encodeURIComponent(baseInput))));
    const decodeBase64 = () => {
        try {
            setBaseOutput(decodeURIComponent(escape(atob(baseInput))));
        } catch (error) {
            setBaseOutput(error instanceof Error ? error.message : "Invalid Base64");
        }
    };

    const generateUuids = () => {
        setUuids(Array.from({ length: 8 }, () => crypto.randomUUID()));
    };

    const convertTimestamp = () => {
        const numeric = Number(timestampInput);
        const date =
            timestampInput.length <= 10
                ? new Date(numeric * 1000)
                : new Date(numeric);

        if (Number.isNaN(date.getTime())) {
            setTimestampOutput("Invalid timestamp.");
            return;
        }

        setTimestampOutput(
            [
                `ISO: ${date.toISOString()}`,
                `Local: ${date.toLocaleString()}`,
                `Unix seconds: ${Math.floor(date.getTime() / 1000)}`,
                `Unix milliseconds: ${date.getTime()}`,
            ].join("\n"),
        );
    };

    const convertNow = () => {
        const now = new Date();
        setTimestampInput(Math.floor(now.getTime() / 1000).toString());
        setTimestampOutput(
            [
                `ISO: ${now.toISOString()}`,
                `Local: ${now.toLocaleString()}`,
                `Unix seconds: ${Math.floor(now.getTime() / 1000)}`,
                `Unix milliseconds: ${now.getTime()}`,
            ].join("\n"),
        );
    };

    const convertColor = () => {
        try {
            const color = hexToColor(colorInput);
            setColorOutput([color.hex, color.rgb, color.hsl].join("\n"));
        } catch (error) {
            setColorOutput(error instanceof Error ? error.message : "Invalid color");
        }
    };

    const testRegex = () => {
        try {
            const regex = new RegExp(regexPattern, regexFlags);
            const matches = Array.from(regexText.matchAll(regex));
            setRegexOutput(
                matches.length
                    ? matches
                          .map(
                              (match, index) =>
                                  `${index + 1}. "${match[0]}" at index ${match.index}`,
                          )
                          .join("\n")
                    : "No matches found.",
            );
        } catch (error) {
            setRegexOutput(error instanceof Error ? error.message : "Invalid regex");
        }
    };

    const generateHash = async () => {
        const buffer = await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(hashInput),
        );
        setHashOutput(bytesToHex(buffer));
    };

    const decodeJwt = () => {
        try {
            const [header, payload] = jwtInput.split(".");

            if (!header || !payload) {
                throw new Error("JWT must contain header and payload parts.");
            }

            setJwtOutput(
                JSON.stringify(
                    {
                        header: JSON.parse(decodeBase64Url(header)),
                        payload: JSON.parse(decodeBase64Url(payload)),
                    },
                    null,
                    4,
                ),
            );
        } catch (error) {
            setJwtOutput(error instanceof Error ? error.message : "Invalid JWT");
        }
    };

    const copyOutput = async (value: string) => {
        if (!value) return;
        await navigator.clipboard.writeText(value);
    };

    return (
        <main className="animated-surface relative min-h-screen overflow-hidden px-4 py-4 text-slate-950 sm:px-6 lg:px-8">
            <div className="liquid-bg" />
            <div className="dot-bg" />

            <Navbar />

            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-5 py-6 sm:py-8">
                <header className="overflow-hidden rounded-lg border border-white/80 bg-white/55 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
                    <div className="grid gap-5 p-5 lg:grid-cols-[1fr_380px] lg:p-6">
                        <div className="flex flex-col justify-between gap-6">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                                    {t("dev.eyebrow")}
                                </p>
                                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                                    {t("dev.title")}
                                </h1>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                                    {t("dev.copy")}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {[t("dev.private"), t("dev.noBackend"), t("dev.fast")].map(
                                    (item) => (
                                        <span
                                            key={item}
                                            className="rounded-full border border-white/80 bg-white/65 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur"
                                        >
                                            {item}
                                        </span>
                                    ),
                                )}
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                            <div className="rounded-lg border border-white/80 bg-slate-950 p-4 text-white shadow-xl shadow-slate-900/15">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
                                    {t("dev.active")}
                                </p>
                                <p className="mt-3 truncate text-2xl font-semibold">
                                    {t(active.nameKey)}
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-300">
                                    {t(active.descriptionKey)}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-lg border border-white/80 bg-white/75 px-4 py-3 shadow-sm backdrop-blur">
                                    <p className="text-xs font-medium text-slate-500">
                                        {t("dev.tools")}
                                    </p>
                                    <p className="mt-1 text-2xl font-semibold">
                                        {tools.length}
                                    </p>
                                </div>
                                <div className="rounded-lg border border-white/80 bg-white/75 px-4 py-3 shadow-sm backdrop-blur">
                                    <p className="text-xs font-medium text-slate-500">
                                        {t("dev.category")}
                                    </p>
                                    <p className="mt-1 text-2xl font-semibold text-blue-700">
                                        {active.category}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="grid gap-5 lg:grid-cols-[320px_1fr]">
                    <aside className="h-fit rounded-lg border border-white/80 bg-white/55 p-3 shadow-xl shadow-slate-900/10 backdrop-blur-xl">
                        <div className="mb-3 flex items-center justify-between px-2 py-1">
                            <div>
                                <p className="text-sm font-semibold text-slate-950">
                                    {t("dev.toolbox")}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    {t("dev.toolboxCopy")}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            {tools.map((tool, index) => (
                                <button
                                    key={tool.id}
                                    onClick={() => setActiveTool(tool.id)}
                                    className={`group grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] ${
                                        activeTool === tool.id
                                            ? "border border-white/90 bg-white/90 shadow-lg shadow-blue-100/80"
                                            : "border border-transparent hover:border-white/80 hover:bg-white/65"
                                    }`}
                                >
                                    <span
                                        className={`flex h-11 w-11 items-center justify-center rounded-lg text-xs font-bold ${
                                            activeTool === tool.id
                                                ? "bg-blue-600 text-white"
                                                : "bg-white/75 text-slate-600 group-hover:bg-white"
                                        }`}
                                    >
                                        {tool.shortcut}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block truncate text-sm font-semibold text-slate-950">
                                        {t(tool.nameKey)}
                                        </span>
                                        <span className="mt-1 block line-clamp-2 text-xs leading-5 text-slate-500">
                                            {t(tool.descriptionKey)}
                                        </span>
                                    </span>
                                    <span className="text-xs font-semibold text-slate-400">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </aside>

                    <section className="min-w-0 overflow-hidden rounded-lg border border-white/80 bg-white/60 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
                        <div className="border-b border-white/70 bg-white/45 p-5 sm:p-6">
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white shadow-lg shadow-slate-900/20">
                                        {active.shortcut}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                                            {active.category}
                                        </p>
                                        <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                                            {t(active.nameKey)}
                                        </h2>
                                        <p className="mt-1 text-sm leading-6 text-slate-500">
                                            {t(active.descriptionKey)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 sm:p-6">
                        {activeTool === "json" ? (
                            <div className="grid gap-5">
                                <Field
                                    label={t("dev.jsonInput")}
                                    hint={`${jsonInput.length} chars`}
                                >
                                    <TextArea
                                        value={jsonInput}
                                        onChange={setJsonInput}
                                    />
                                </Field>
                                <div className="flex flex-wrap gap-3 rounded-lg border border-white/70 bg-white/45 p-3 backdrop-blur">
                                    <Button onClick={formatJson}>
                                        {t("dev.format")}
                                    </Button>
                                    <Button onClick={minifyJson} variant="ghost">
                                        {t("dev.minify")}
                                    </Button>
                                    <Button
                                        onClick={() => copyOutput(jsonOutput)}
                                        variant="ghost"
                                    >
                                        {t("dev.copyButton")}
                                    </Button>
                                </div>
                                <Output
                                    value={jsonOutput}
                                    label={t("dev.formattedOutput")}
                                />
                            </div>
                        ) : null}

                        {activeTool === "url" ? (
                            <div className="grid gap-5">
                                <Field
                                    label={t("dev.urlText")}
                                    hint={t("dev.encodeOrDecode")}
                                >
                                    <TextArea
                                        value={urlInput}
                                        onChange={setUrlInput}
                                    />
                                </Field>
                                <div className="flex flex-wrap gap-3 rounded-lg border border-white/70 bg-white/45 p-3 backdrop-blur">
                                    <Button onClick={encodeUrl}>
                                        {t("dev.encode")}
                                    </Button>
                                    <Button onClick={decodeUrl} variant="ghost">
                                        {t("dev.decode")}
                                    </Button>
                                </div>
                                <Output value={urlOutput} />
                            </div>
                        ) : null}

                        {activeTool === "base64" ? (
                            <div className="grid gap-5">
                                <Field label={t("dev.text")} hint={t("dev.utf8")}>
                                    <TextArea
                                        value={baseInput}
                                        onChange={setBaseInput}
                                    />
                                </Field>
                                <div className="flex flex-wrap gap-3 rounded-lg border border-white/70 bg-white/45 p-3 backdrop-blur">
                                    <Button onClick={encodeBase64}>
                                        {t("dev.encode")}
                                    </Button>
                                    <Button onClick={decodeBase64} variant="ghost">
                                        {t("dev.decode")}
                                    </Button>
                                </div>
                                <Output value={baseOutput} />
                            </div>
                        ) : null}

                        {activeTool === "uuid" ? (
                            <div className="grid gap-5">
                                <div className="rounded-lg border border-white/70 bg-white/55 p-5 backdrop-blur">
                                    <p className="text-sm font-semibold text-slate-900">
                                        {t("dev.uuidCopy")}
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        {t("dev.uuidHint")}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-3 rounded-lg border border-white/70 bg-white/45 p-3 backdrop-blur">
                                    <Button onClick={generateUuids}>
                                        {t("dev.generateUuids")}
                                    </Button>
                                    <Button
                                        onClick={() => copyOutput(uuids.join("\n"))}
                                        variant="ghost"
                                    >
                                        {t("dev.copyButton")}
                                    </Button>
                                </div>
                                <Output value={uuids.join("\n")} />
                            </div>
                        ) : null}

                        {activeTool === "timestamp" ? (
                            <div className="grid gap-5">
                                <Field
                                    label={t("dev.timestamp")}
                                    hint={t("dev.secondsMs")}
                                >
                                    <Input
                                        value={timestampInput}
                                        onChange={setTimestampInput}
                                        placeholder="1719000000"
                                    />
                                </Field>
                                <div className="flex flex-wrap gap-3 rounded-lg border border-white/70 bg-white/45 p-3 backdrop-blur">
                                    <Button onClick={convertTimestamp}>
                                        {t("dev.convert")}
                                    </Button>
                                    <Button onClick={convertNow} variant="ghost">
                                        {t("dev.useNow")}
                                    </Button>
                                </div>
                                <Output value={timestampOutput} />
                            </div>
                        ) : null}

                        {activeTool === "color" ? (
                            <div className="grid gap-5">
                                <Field
                                    label={t("dev.hexColor")}
                                    hint={t("dev.hexHint")}
                                >
                                    <Input
                                        value={colorInput}
                                        onChange={setColorInput}
                                        placeholder="#2563eb"
                                    />
                                </Field>
                                <div className="flex flex-wrap items-center gap-3 rounded-lg border border-white/70 bg-white/45 p-3 backdrop-blur">
                                    <Button onClick={convertColor}>
                                        {t("dev.convert")}
                                    </Button>
                                    <div
                                        className="h-12 w-28 rounded-lg border border-white/80 shadow-inner shadow-slate-900/10"
                                        style={{ backgroundColor: colorInput }}
                                    />
                                </div>
                                <Output value={colorOutput} />
                            </div>
                        ) : null}

                        {activeTool === "regex" ? (
                            <div className="grid gap-5">
                                <div className="grid gap-4 md:grid-cols-[1fr_120px]">
                                    <Field
                                        label={t("dev.pattern")}
                                        hint={t("dev.regexHint")}
                                    >
                                        <Input
                                            value={regexPattern}
                                            onChange={setRegexPattern}
                                        />
                                    </Field>
                                    <Field label={t("dev.flags")} hint="g i m s u y">
                                        <Input
                                            value={regexFlags}
                                            onChange={setRegexFlags}
                                            placeholder="gi"
                                        />
                                    </Field>
                                </div>
                                <Field label={t("dev.text")}>
                                    <TextArea
                                        value={regexText}
                                        onChange={setRegexText}
                                    />
                                </Field>
                                <div className="flex flex-wrap gap-3 rounded-lg border border-white/70 bg-white/45 p-3 backdrop-blur">
                                    <Button onClick={testRegex}>
                                        {t("dev.testRegex")}
                                    </Button>
                                </div>
                                <Output value={regexOutput} />
                            </div>
                        ) : null}

                        {activeTool === "hash" ? (
                            <div className="grid gap-5">
                                <Field label={t("dev.text")} hint={t("dev.shaHint")}>
                                    <TextArea
                                        value={hashInput}
                                        onChange={setHashInput}
                                    />
                                </Field>
                                <div className="flex flex-wrap gap-3 rounded-lg border border-white/70 bg-white/45 p-3 backdrop-blur">
                                    <Button onClick={() => void generateHash()}>
                                        {t("dev.generateSha")}
                                    </Button>
                                    <Button
                                        onClick={() => copyOutput(hashOutput)}
                                        variant="ghost"
                                    >
                                        {t("dev.copyButton")}
                                    </Button>
                                </div>
                                <Output value={hashOutput} />
                            </div>
                        ) : null}

                        {activeTool === "jwt" ? (
                            <div className="grid gap-5">
                                <Field label={t("dev.jwt")} hint={t("dev.jwtHint")}>
                                    <TextArea
                                        value={jwtInput}
                                        onChange={setJwtInput}
                                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                    />
                                </Field>
                                <div className="flex flex-wrap gap-3 rounded-lg border border-white/70 bg-white/45 p-3 backdrop-blur">
                                    <Button onClick={decodeJwt}>
                                        {t("dev.decodeJwt")}
                                    </Button>
                                </div>
                                <Output value={jwtOutput} />
                            </div>
                        ) : null}

                        {activeTool === "case" ? (
                            <div className="grid gap-5">
                                <Field
                                    label={t("dev.text")}
                                    hint={t("dev.caseHint")}
                                >
                                    <TextArea
                                        value={caseInput}
                                        onChange={setCaseInput}
                                    />
                                </Field>
                                <Output value={caseOutput} />
                            </div>
                        ) : null}
                        </div>
                    </section>
                </section>
            </div>
        </main>
    );
}
