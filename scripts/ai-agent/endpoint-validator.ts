export function isValidEndpoint(url: string, realApis: any[]) {
    return realApis.some(api =>
        url.includes(api.url) || api.url.includes(url)
    );
}