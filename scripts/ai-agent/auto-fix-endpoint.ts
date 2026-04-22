import { getApiRequests } from "./filter-runtime";

type Endpoint = {
    method: string;
    url: string;
};

export function fixEndpoint(badUrl: string): string {
    const realApis: Endpoint[] = getApiRequests();

    if (!realApis.length) return badUrl;

    const match = realApis.find((api: Endpoint) =>
        badUrl.includes("/search") && api.url.includes("/search")
    );

    if (match) {
        const base = match.url.split("?")[0];
        const query = badUrl.split("?")[1];

        const fixed = query ? `${base}?${query}` : match.url;

        if (fixed !== badUrl) {
            console.log("🔧 Corrigindo endpoint:", badUrl, "→", fixed);
        }

        return fixed;
    }

    return badUrl;
}