import fs from "fs";
import path from "path";

type Endpoint = {
    method: string;
    url: string;
};

export function extractEndpointsFromTests(): Endpoint[] {
    const testDir = path.resolve("cypress/e2e");

    if (!fs.existsSync(testDir)) return [];

    const endpointSet = new Set<string>();

    function readFiles(dir: string) {
        const files = fs.readdirSync(dir);

        files.forEach((file) => {
            const fullPath = path.join(dir, file);

            if (fs.statSync(fullPath).isDirectory()) {
                readFiles(fullPath);
            } else if (file.endsWith(".js") || file.endsWith(".ts")) {
                const content = fs.readFileSync(fullPath, "utf-8");

                const regex =
                    /cy\.intercept\(\s*['"`](GET|POST|PUT|DELETE)['"`]\s*,\s*['"`]([^'"`]+)['"`]/g;

                let match;

                while ((match = regex.exec(content)) !== null) {
                    const method = match[1];
                    const url = match[2];

                    // 🔥 chave única
                    endpointSet.add(`${method}::${url}`);
                }
            }
        });
    }

    readFiles(testDir);

    // 🔥 transforma de volta em array
    return Array.from(endpointSet).map((item) => {
        const [method, url] = item.split("::");
        return { method, url };
    });
}