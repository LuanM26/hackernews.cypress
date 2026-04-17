import fs from "fs";

export function analyzeFailures() {
    const filePath = "scripts/ai-agent/test-failures.json";

    if (!fs.existsSync(filePath)) return [];

    const raw = fs.readFileSync(filePath, "utf-8").trim();

    if (!raw) return []; // 🔥 evita crash

    try {
        return JSON.parse(raw);
    } catch (e) {
        console.log("⚠️ JSON inválido, ignorando falhas...");
        return [];
    }
}