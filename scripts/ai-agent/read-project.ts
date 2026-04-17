import { globSync } from "glob";
import fs from "fs";

export function readProject() {
    const files = globSync("cypress/**/*.cy.{js,ts}");

    return files.map((file) => ({
        path: file,
        content: fs.readFileSync(file, "utf-8"),
    }));
}

// 👇 TESTE
console.log(readProject());