export function isValidEndpoint(
    endpoint: string,
    method: string,
    realApis: { url: string; method: string }[]
) {
    return realApis.some(api =>
        api.method === method &&
        api.url.includes(endpoint)
    );
}