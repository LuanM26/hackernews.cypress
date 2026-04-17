export function removeSequentialDuplicates(actions: string[]) {
    return actions.filter((action, index) => {
        return action !== actions[index - 1];
    });
}
export function removeRepeatedBlocks(actions: string[]) {
    const seen = new Set<string>();
    const result: string[] = [];

    actions.forEach((_, i) => {
        const slice = actions.slice(i, i + 4).join("|");

        if (!seen.has(slice)) {
            seen.add(slice);
            result.push(actions[i]);
        }
    });

    return result;
}