import fs from "fs";

export function getApiRequests() {
    const data = JSON.parse(
        fs.readFileSync("scripts/ai-agent/runtime-requests.json", "utf-8")
    );

    return data.filter((req: any) => {
        return req.url.includes("/api/");
    });
}