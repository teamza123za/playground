"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

type Language = "en" | "th";
type Dictionary = Record<string, string>;

const dictionaries: Record<Language, Dictionary> = {
    en: {
        "nav.home": "Home",
        "nav.devTools": "Dev Tools",
        "nav.todos": "Todos",
        "nav.language": "Language",
        "home.badge": "WELCOME",
        "home.titleA": "Build better with",
        "home.copy":
            "A simple playground for learning, building, and testing ideas with Next.js, TypeScript, Express, Prisma, and modern web tools.",
        "home.cta": "Start building now",
        "todos.eyebrow": "Slowwork board",
        "todos.title": "Focus lanes",
        "todos.copy":
            "A compact kanban workspace for daily tasks. Move cards through Todo, Doing, and Done.",
        "todos.input": "Write a task...",
        "todos.add": "Add",
        "todos.total": "Total",
        "todos.todo": "Todo",
        "todos.doing": "Doing",
        "todos.done": "Done",
        "todos.progress": "Progress",
        "todos.loading": "Loading tasks...",
        "todos.noCards": "No cards",
        "todos.drop": "Drop a task here.",
        "todos.todoCaption": "Tasks waiting to be picked up",
        "todos.doingCaption": "Work currently in motion",
        "todos.doneCaption": "Completed work",
        "todos.reopen": "Reopen",
        "todos.delete": "Delete",
        "todos.loadError": "Could not load todos. Check that the backend is running.",
        "todos.addError": "Could not add this todo.",
        "todos.updateError": "Could not update this todo.",
        "todos.deleteError": "Could not delete this todo.",
        "json.eyebrow": "Developer Tool",
        "json.title": "JSON Formatter",
        "json.copy":
            "Paste JSON to format, validate, or minify it in one place.",
        "json.inputLines": "Input lines",
        "json.outputChars": "Output chars",
        "json.input": "Input JSON",
        "json.characters": "characters",
        "json.sample": "Sample",
        "json.actions": "Actions",
        "json.actionsCopy":
            "Choose the output format you need, then copy it for the next step.",
        "json.format": "Format JSON",
        "json.minify": "Minify JSON",
        "json.copyOutput": "Copy Output",
        "json.copied": "Copied",
        "json.clear": "Clear",
        "json.ready": "JSON is ready to validate and format.",
        "json.output": "Output",
        "json.lines": "lines",
        "json.placeholder": "Formatted JSON will appear here.",
        "dev.eyebrow": "Daily Developer Utilities",
        "dev.title": "Dev Tools",
        "dev.copy":
            "Ten practical browser tools for formatting, encoding, generating, converting, and debugging common developer data.",
        "dev.private": "Private in browser",
        "dev.noBackend": "No backend calls",
        "dev.fast": "Fast daily utilities",
        "dev.active": "Active workspace",
        "dev.tools": "Tools",
        "dev.category": "Category",
        "dev.toolbox": "Toolbox",
        "dev.toolboxCopy": "Pick a utility to open its workspace.",
        "dev.browserOnly": "Browser only",
        "dev.result": "Result",
        "dev.outputPlaceholder": "Output will appear here.",
        "dev.jsonInput": "JSON input",
        "dev.formattedOutput": "Formatted output",
        "dev.format": "Format",
        "dev.minify": "Minify",
        "dev.copyButton": "Copy",
        "dev.urlText": "URL text",
        "dev.encodeOrDecode": "Encode or decode",
        "dev.encode": "Encode",
        "dev.decode": "Decode",
        "dev.text": "Text",
        "dev.utf8": "UTF-8 supported",
        "dev.uuidCopy": "Generate eight random UUID v4 values.",
        "dev.uuidHint":
            "Useful for fixtures, test records, and local development data.",
        "dev.generateUuids": "Generate UUIDs",
        "dev.timestamp": "Unix timestamp",
        "dev.secondsMs": "Seconds or milliseconds",
        "dev.convert": "Convert",
        "dev.useNow": "Use now",
        "dev.hexColor": "HEX color",
        "dev.hexHint": "3 or 6 digits",
        "dev.pattern": "Pattern",
        "dev.regexHint": "JavaScript regex",
        "dev.flags": "Flags",
        "dev.testRegex": "Test regex",
        "dev.shaHint": "SHA-256",
        "dev.generateSha": "Generate SHA-256",
        "dev.jwt": "JWT",
        "dev.jwtHint": "Decoded only, not verified",
        "dev.decodeJwt": "Decode JWT",
        "dev.caseHint": "Common naming styles",
        "tool.json.name": "JSON Formatter",
        "tool.json.desc": "Format, minify, and validate JSON payloads.",
        "tool.url.name": "URL Encoder",
        "tool.url.desc": "Encode and decode query strings or URL fragments.",
        "tool.base64.name": "Base64",
        "tool.base64.desc": "Convert plain text to and from Base64.",
        "tool.uuid.name": "UUID Generator",
        "tool.uuid.desc": "Generate random UUID v4 values.",
        "tool.timestamp.name": "Timestamp",
        "tool.timestamp.desc": "Convert Unix timestamps and local date time.",
        "tool.color.name": "Color Converter",
        "tool.color.desc": "Convert HEX colors to RGB and HSL.",
        "tool.regex.name": "Regex Tester",
        "tool.regex.desc": "Test JavaScript regular expressions quickly.",
        "tool.hash.name": "Hash Generator",
        "tool.hash.desc": "Create SHA-256 hashes in the browser.",
        "tool.jwt.name": "JWT Decoder",
        "tool.jwt.desc": "Decode JWT header and payload without verifying.",
        "tool.case.name": "Text Case",
        "tool.case.desc": "Transform text into common naming styles.",
    },
    th: {
        "nav.home": "หน้าแรก",
        "nav.devTools": "เครื่องมือ Dev",
        "nav.todos": "งาน",
        "nav.language": "ภาษา",
        "home.badge": "ยินดีต้อนรับ",
        "home.titleA": "สร้างงานให้ดีขึ้นด้วย",
        "home.copy":
            "พื้นที่ทดลองสำหรับเรียนรู้ สร้าง และทดสอบไอเดียด้วย Next.js, TypeScript, Express, Prisma และเครื่องมือเว็บสมัยใหม่",
        "home.cta": "เริ่มใช้งาน",
        "todos.eyebrow": "บอร์ด Slowwork",
        "todos.title": "โฟกัสงานเป็นขั้นตอน",
        "todos.copy":
            "บอร์ด Kanban ขนาดกะทัดรัดสำหรับงานประจำวัน ย้ายงานผ่าน Todo, Doing และ Done ได้ง่าย",
        "todos.input": "เขียนงานใหม่...",
        "todos.add": "เพิ่ม",
        "todos.total": "ทั้งหมด",
        "todos.todo": "Todo",
        "todos.doing": "Doing",
        "todos.done": "Done",
        "todos.progress": "ความคืบหน้า",
        "todos.loading": "กำลังโหลดงาน...",
        "todos.noCards": "ยังไม่มีการ์ด",
        "todos.drop": "ลากงานมาวางที่นี่",
        "todos.todoCaption": "งานที่รอเริ่มทำ",
        "todos.doingCaption": "งานที่กำลังทำอยู่",
        "todos.doneCaption": "งานที่ทำเสร็จแล้ว",
        "todos.reopen": "เปิดใหม่",
        "todos.delete": "ลบ",
        "todos.loadError": "โหลดรายการงานไม่ได้ กรุณาตรวจสอบว่า backend ทำงานอยู่",
        "todos.addError": "เพิ่มงานนี้ไม่ได้",
        "todos.updateError": "อัปเดตงานนี้ไม่ได้",
        "todos.deleteError": "ลบงานนี้ไม่ได้",
        "json.eyebrow": "เครื่องมือสำหรับนักพัฒนา",
        "json.title": "จัดรูปแบบ JSON",
        "json.copy":
            "วาง JSON เพื่อจัดรูปแบบ ตรวจสอบ หรือบีบให้สั้นในหน้าเดียว",
        "json.inputLines": "บรรทัดอินพุต",
        "json.outputChars": "ตัวอักษรเอาต์พุต",
        "json.input": "JSON ต้นฉบับ",
        "json.characters": "ตัวอักษร",
        "json.sample": "ตัวอย่าง",
        "json.actions": "คำสั่ง",
        "json.actionsCopy":
            "เลือกรูปแบบผลลัพธ์ที่ต้องการ แล้วคัดลอกไปใช้งานต่อ",
        "json.format": "จัดรูปแบบ JSON",
        "json.minify": "บีบ JSON",
        "json.copyOutput": "คัดลอกผลลัพธ์",
        "json.copied": "คัดลอกแล้ว",
        "json.clear": "ล้าง",
        "json.ready": "JSON พร้อมตรวจสอบและจัดรูปแบบ",
        "json.output": "ผลลัพธ์",
        "json.lines": "บรรทัด",
        "json.placeholder": "ผลลัพธ์ JSON จะแสดงที่นี่",
        "dev.eyebrow": "เครื่องมือ Dev ที่ใช้บ่อย",
        "dev.title": "เครื่องมือ Dev",
        "dev.copy":
            "เครื่องมือใน browser สำหรับจัดรูปแบบ เข้ารหัส สร้าง แปลง และดีบักข้อมูลที่ใช้บ่อย",
        "dev.private": "ทำงานใน browser",
        "dev.noBackend": "ไม่เรียก backend",
        "dev.fast": "ใช้งานได้รวดเร็ว",
        "dev.active": "พื้นที่ทำงาน",
        "dev.tools": "เครื่องมือ",
        "dev.category": "หมวดหมู่",
        "dev.toolbox": "กล่องเครื่องมือ",
        "dev.toolboxCopy": "เลือกเครื่องมือเพื่อเปิดพื้นที่ทำงาน",
        "dev.browserOnly": "ทำงานใน browser",
        "dev.result": "ผลลัพธ์",
        "dev.outputPlaceholder": "ผลลัพธ์จะแสดงที่นี่",
        "dev.jsonInput": "JSON ต้นฉบับ",
        "dev.formattedOutput": "ผลลัพธ์ที่จัดรูปแบบ",
        "dev.format": "จัดรูปแบบ",
        "dev.minify": "บีบให้สั้น",
        "dev.copyButton": "คัดลอก",
        "dev.urlText": "ข้อความ URL",
        "dev.encodeOrDecode": "เข้ารหัสหรือถอดรหัส",
        "dev.encode": "เข้ารหัส",
        "dev.decode": "ถอดรหัส",
        "dev.text": "ข้อความ",
        "dev.utf8": "รองรับ UTF-8",
        "dev.uuidCopy": "สร้าง UUID v4 แบบสุ่ม 8 รายการ",
        "dev.uuidHint": "เหมาะสำหรับข้อมูลทดสอบ fixture และงานพัฒนา local",
        "dev.generateUuids": "สร้าง UUID",
        "dev.timestamp": "Unix timestamp",
        "dev.secondsMs": "วินาทีหรือมิลลิวินาที",
        "dev.convert": "แปลง",
        "dev.useNow": "ใช้เวลาปัจจุบัน",
        "dev.hexColor": "สี HEX",
        "dev.hexHint": "3 หรือ 6 หลัก",
        "dev.pattern": "แพตเทิร์น",
        "dev.regexHint": "JavaScript regex",
        "dev.flags": "Flags",
        "dev.testRegex": "ทดสอบ regex",
        "dev.shaHint": "SHA-256",
        "dev.generateSha": "สร้าง SHA-256",
        "dev.jwt": "JWT",
        "dev.jwtHint": "ถอดรหัสเท่านั้น ไม่ตรวจลายเซ็น",
        "dev.decodeJwt": "ถอดรหัส JWT",
        "dev.caseHint": "รูปแบบชื่อที่ใช้บ่อย",
        "tool.json.name": "จัดรูปแบบ JSON",
        "tool.json.desc": "จัดรูปแบบ บีบ และตรวจสอบ JSON payload",
        "tool.url.name": "เข้ารหัส URL",
        "tool.url.desc": "เข้ารหัสและถอดรหัส query string หรือ URL fragment",
        "tool.base64.name": "Base64",
        "tool.base64.desc": "แปลงข้อความเป็น Base64 และแปลงกลับ",
        "tool.uuid.name": "สร้าง UUID",
        "tool.uuid.desc": "สร้าง UUID v4 แบบสุ่ม",
        "tool.timestamp.name": "Timestamp",
        "tool.timestamp.desc": "แปลง Unix timestamp และเวลาท้องถิ่น",
        "tool.color.name": "แปลงสี",
        "tool.color.desc": "แปลงสี HEX เป็น RGB และ HSL",
        "tool.regex.name": "ทดสอบ Regex",
        "tool.regex.desc": "ทดสอบ JavaScript regular expression อย่างรวดเร็ว",
        "tool.hash.name": "สร้าง Hash",
        "tool.hash.desc": "สร้าง SHA-256 hash ใน browser",
        "tool.jwt.name": "ถอดรหัส JWT",
        "tool.jwt.desc": "ถอดรหัส header และ payload ของ JWT โดยไม่ verify",
        "tool.case.name": "แปลงตัวพิมพ์",
        "tool.case.desc": "แปลงข้อความเป็นรูปแบบการตั้งชื่อที่ใช้บ่อย",
    },
};

type LanguageContextValue = {
    language: Language;
    setLanguage: (language: Language) => void;
    toggleLanguage: () => void;
    t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        if (typeof window === "undefined") return "en";
        return window.localStorage.getItem("slowwork-language") === "th"
            ? "th"
            : "en";
    });

    const setLanguage = useCallback((nextLanguage: Language) => {
        setLanguageState(nextLanguage);
        window.localStorage.setItem("slowwork-language", nextLanguage);
    }, []);

    const toggleLanguage = useCallback(() => {
        setLanguage(language === "en" ? "th" : "en");
    }, [language, setLanguage]);

    const translate = useCallback(
        (key: string) => dictionaries[language][key] ?? key,
        [language],
    );

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    const value = useMemo(
        () => ({
            language,
            setLanguage,
            toggleLanguage,
            t: translate,
        }),
        [language, setLanguage, toggleLanguage, translate],
    );

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const value = useContext(LanguageContext);

    if (!value) {
        throw new Error("useLanguage must be used inside LanguageProvider.");
    }

    return value;
}
