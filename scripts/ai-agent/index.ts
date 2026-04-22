import { getApiRequests } from "./filter-runtime";
import { extractEndpointsFromTests } from "./extract-endpoints";
import { compareCoverage } from "./compare-coverage";
import { analyzeTestQuality } from "./analyze-test-quality";
import { generateTests } from "./generate-tests";
import { generateE2E } from "./generate-e2e";
import { generateReadme } from "./generate-readme";
import { readExistingE2E } from "./read-existing-e2e";
import { detectGaps } from "./detect-gaps";

type QualityItem = {
    file: string;
    hasStatusCheck: boolean;
    hasErrorTest: boolean;
    hasPagination: boolean;
    hasSchemaValidation: boolean;
};

console.log("🚀 AI QA Agent iniciado...");

// ==============================
// 🌐 APIS REAIS
// ==============================
const realApis = getApiRequests();

console.log("\n🌐 APIS REAIS:");
console.log(realApis);

// ==============================
// 📊 ENDPOINTS NOS TESTES
// ==============================
const testEndpoints = extractEndpointsFromTests();

console.log("\n📊 ENDPOINTS NOS TESTES:");
console.log(testEndpoints);

// ==============================
// 🧠 COBERTURA
// ==============================
const coverage = compareCoverage(realApis, testEndpoints);

console.log("\n🧠 COBERTURA REAL:");
console.log(coverage);

// ==============================
// 🧠 QUALIDADE DOS TESTES
// ==============================
const quality: QualityItem[] = analyzeTestQuality();

console.log("\n🧠 QUALIDADE DOS TESTES:");
console.log(quality);

// ==============================
// 🧠 INSIGHTS E2E
// ==============================
const insights = readExistingE2E();

// ==============================
// 🔥 GAP DETECTION
// ==============================
const gaps = detectGaps({
    insights,
    coverage,
    quality
});

console.log("\n🧠 GAPS DETECTADOS:");
console.log(gaps);

// ==============================
// 🤖 GERAÇÃO DE TESTES
// ==============================
console.log("\n🤖 GERANDO TESTES DE API...");
generateTests(gaps);

console.log("\n🤖 GERANDO E2E...");
generateE2E(gaps);

// ==============================
// 📊 SCORE (VERSÃO FINAL CORRIGIDA)
// ==============================

// Coverage
const coverageScore =
    coverage.length > 0
        ? (coverage.filter(c => c.covered).length / coverage.length) * 100
        : 0;

// 🔥 FILTER (REMOVE TESTES RUINS)
const filteredQuality: QualityItem[] = quality.filter((q) =>
    !q.file.includes("auto-generated") ||
    q.hasStatusCheck ||
    q.hasErrorTest
);

// API Quality
const apiQualityScore =
    filteredQuality.length > 0
        ? Math.round(
            (filteredQuality.filter(q => q.hasStatusCheck).length /
                filteredQuality.length) * 100
        )
        : 0;

// E2E Quality
const e2eQualityScore =
    filteredQuality.length > 0
        ? Math.round(
            (filteredQuality.filter(q => q.hasErrorTest).length /
                filteredQuality.length) * 100
        )
        : 0;

// Final Score
const finalScore = Math.round(
    coverageScore * 0.4 +
    apiQualityScore * 0.3 +
    e2eQualityScore * 0.3
);

const score = {
    coverageScore: Math.round(coverageScore),
    apiQualityScore,
    e2eQualityScore,
    finalScore
};

// ==============================
// 📄 README + SCORE
// ==============================
console.log("\n📄 GERANDO README + QA SCORE...");
generateReadme(coverage, quality, score, gaps);

// ==============================
// ✅ FINAL
// ==============================
console.log("\n📊 QA SCORE\n");
console.log(`Coverage: ${score.coverageScore}%`);
console.log(`API Quality: ${score.apiQualityScore}%`);
console.log(`E2E Quality: ${score.e2eQualityScore}%`);
console.log(`\n🏁 Final Score: ${score.finalScore}/100`);

console.log("\n✅ Execução finalizada com sucesso!");