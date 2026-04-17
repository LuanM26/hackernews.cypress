import fs from "fs";
import path from "path";

type TestFile = {
    path: string;
    content: string;
};

function getAllFiles(dir: string): string[] {
    const entries = fs.readdirSync(dir);

    return entries.flatMap((entry) => {
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            return getAllFiles(fullPath); // 🔥 recursivo
        }

        return fullPath;
    });
}

export function readProject(): TestFile[] {
    const basePath = path.resolve("cypress/e2e");

    const allFiles = getAllFiles(basePath);

    return allFiles
        .filter(
            (file) =>
                file.endsWith(".cy.ts") || file.endsWith(".cy.js")
        )
        .map((file) => ({
            path: file,
            content: fs.readFileSync(file, "utf-8"),
        }));
}