import fs from "fs";

export function testAlreadyExists(filePath: string, testName: string): boolean {
    if (!fs.existsSync(filePath)) return false;

    const content = fs.readFileSync(filePath, "utf-8");

    return content.includes(`it('${testName}'`);
}