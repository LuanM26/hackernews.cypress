import fs from "fs";

export function getExistingScenarios(filePath: string): string[] {
    if (!fs.existsSync(filePath)) return [];

    const content = fs.readFileSync(filePath, "utf-8");

    const matches = content.match(/it\(['"`](.*?)['"`]/g);

    if (!matches) return [];

    return matches.map((m) =>
        m.replace(/it\(['"`]/, "").replace(/['"`]$/, "")
    );
}