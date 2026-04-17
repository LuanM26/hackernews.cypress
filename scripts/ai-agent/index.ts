import { extractEndpointsFromTests } from "./coverage-analyzer";
import { getApiRequests } from "./filter-runtime";
import { compareCoverage } from "./compare-coverage";
import { analyzeTestQuality } from "./analyze-test-quality";
import { generateReport } from "./generate-report";
import { extractUIFlows } from "./extract-ui-flow";
import { generateE2ETests } from "./generate-e2e";
import { generateReadme } from "./generate-readme";
import { selfHealTests } from "./self-heal";


console.log("🌐 APIS REAIS:");
const apis = getApiRequests();
console.log(apis);

console.log("\n📊 ENDPOINTS NOS TESTES:");
const tested = extractEndpointsFromTests();
console.log(tested);

console.log("\n🧠 COBERTURA REAL:");
console.log(compareCoverage());

console.log("\n🧠 QUALIDADE DOS TESTES:");
console.log(analyzeTestQuality());

const coverage = compareCoverage();
const quality = analyzeTestQuality();

const report = generateReport(coverage, quality);

console.log("📊 RELATÓRIO FINAL:");
console.log(report);

console.log("\n🖥️ UI FLOWS:");
console.log(extractUIFlows());

console.log("\n🤖 GERANDO E2E...");
generateE2ETests();

console.log("🤖 Aplicando correções automáticas...");
selfHealTests();

generateReadme();