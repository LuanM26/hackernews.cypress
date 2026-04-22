import fs from "fs";
import path from "path";

// ================= SCRIPTS =================

function getAgentScripts() {
    const dir = path.resolve("scripts/ai-agent");

    if (!fs.existsSync(dir)) return [];

    return fs
        .readdirSync(dir)
        .filter((file) => file.endsWith(".ts"))
        .map((file) => file.replace(".ts", ""))
        .sort();
}

function describeScript(name: string) {
    const map: Record<string, string> = {
        "analyze-failures": "Analisa falhas dos testes",
        "analyze-test-quality": "Avalia qualidade dos testes",
        "compare-coverage": "Compara APIs reais com testes",
        "coverage-analyzer": "Calcula cobertura de endpoints",
        "deduplicate-flows": "Remove duplicação de fluxos",
        "detect-devops": "Detecta CI/CD",
        "detect-errors": "Identifica erros recorrentes",
        "endpoint-validator": "Valida endpoints",
        "extract-ui-flow": "Extrai fluxo de UI",
        "filter-runtime": "Filtra requisições reais",
        "flow-intelligence": "Aplica inteligência ao fluxo",
        "flow-utils": "Utilidades de fluxo",
        "generate-e2e": "Gera testes E2E",
        "generate-readme": "Gera README automaticamente",
        "generate-report": "Gera relatório de qualidade",
        "generate-tests": "Gera testes de API",
        "index": "Orquestrador do agente",
        "read-project": "Lê estrutura do projeto",
        "selector-utils": "Corrige seletores",
        "self-heal": "Auto-correção de testes",
        "qa-score": "Calcula QA Score",
    };

    return map[name] || "Script do agente";
}

function generateScriptsSection() {
    const scripts = getAgentScripts();

    if (!scripts.length) return "";

    return `
## 🤖 AI Agent Scripts

| Script | Descrição |
|--------|----------|
${scripts.map(s => `| ${s} | ${describeScript(s)} |`).join("\n")}
`;
}

// ================= DEPENDÊNCIAS =================

function getDependencies() {
    const packagePath = path.resolve("package.json");

    if (!fs.existsSync(packagePath)) return { deps: [], devDeps: [], raw: {} };

    const pkg = JSON.parse(fs.readFileSync(packagePath, "utf-8"));

    return {
        deps: Object.keys(pkg.dependencies || {}),
        devDeps: Object.keys(pkg.devDependencies || {}),
        raw: pkg,
    };
}

function describeDependency(name: string) {
    const map: Record<string, string> = {
        cypress: "Framework de testes E2E",
        typescript: "Tipagem estática",
        "ts-node": "Execução TS no Node",
        "@faker-js/faker": "Dados fake",
        eslint: "Linting",
        prettier: "Formatação",
    };

    return map[name] || "Dependência";
}

function generateDependenciesSection() {
    const { deps, devDeps, raw } = getDependencies();

    if (!deps.length && !devDeps.length) return "";

    return `
## 📦 Dependências

### 🔹 Produção

| Pacote | Versão | Descrição |
|--------|--------|----------|
${deps.map(d => `| ${d} | ${raw.dependencies[d]} | ${describeDependency(d)} |`).join("\n")}

### 🔹 Desenvolvimento

| Pacote | Versão | Descrição |
|--------|--------|----------|
${devDeps.map(d => `| ${d} | ${raw.devDependencies[d]} | ${describeDependency(d)} |`).join("\n")}
`;
}

// ================= MAIN =================

type CoverageItem = {
    endpoint: string;
    method: string;
    covered: boolean;
};

type QualityItem = {
    file: string;
    hasStatusCheck: boolean;
    hasErrorTest: boolean;
    hasPagination: boolean;
    hasSchemaValidation: boolean;
};

type Score = {
    coverageScore: number;
    apiQualityScore: number;
    e2eQualityScore: number;
    finalScore: number;
};

export function generateReadme(
    coverage: CoverageItem[],
    quality: QualityItem[],
    score: Score,
    gaps: any
) {
    const scriptsSection = generateScriptsSection();
    const dependenciesSection = generateDependenciesSection();

    // ==============================
    // 🧠 GAP SECTION (NOVO)
    // ==============================
    const gapsSection = `
## 🧠 GAP Analysis

- Empty Search: ${gaps.missingEmptySearch ? "❌ Missing" : "✅ OK"}
- Error Handling: ${gaps.missingErrorHandling ? "❌ Missing" : "✅ OK"}
- Pagination: ${gaps.missingPagination ? "❌ Missing" : "✅ OK"}
- Status Check: ${gaps.missingStatusCheck ? "❌ Missing" : "✅ OK"}
- Uncovered Endpoints: ${gaps.uncoveredEndpoints?.length || 0}

---`;

    const content = `
<p align="center">
  <img src="https://img.shields.io/badge/QA-${score.finalScore}%25-${getBadgeColor(score.finalScore)}?style=for-the-badge" />
</p>

# 🚀 Cypress AI Automation Project

Projeto de automação com Cypress evoluído para um **Agente Inteligente de QA**.

---

## ⚙️ Stack

- Cypress
- TypeScript
- Node.js
- Faker
- GitHub Actions
- Cypress Cloud

---

${dependenciesSection}

---

${scriptsSection}

---

## 📊 QA Score

### 📈 Resultado atual

\`\`\`
Coverage: ${score.coverageScore}%
API Quality: ${score.apiQualityScore}%
E2E Quality: ${score.e2eQualityScore}%

Final Score: ${score.finalScore}/100
\`\`\`

### 🧮 Cálculo

- Coverage → 40%
- API Quality → 30%
- E2E Quality → 30%

---

${gapsSection}

## 📡 Cobertura

- Endpoints analisados: ${coverage.length}
- Cobertos: ${coverage.filter(c => c.covered).length}

---

## 🧪 Qualidade dos Testes

${quality.map(q => `
### ${q.file}

- Status: ${q.hasStatusCheck ? "✅" : "❌"}
- Error: ${q.hasErrorTest ? "✅" : "❌"}
- Pagination: ${q.hasPagination ? "✅" : "❌"}
- Schema: ${q.hasSchemaValidation ? "✅" : "❌"}
`).join("\n")}

---

## 🚀 Execução

\`\`\`bash
npx ts-node scripts/ai-agent/index.ts
\`\`\`

---

## 👨‍💻 Autor

Luan Macedo
`;

    fs.writeFileSync("README.md", content);

    // ==============================
    // 📊 LOG LIMPO (NOVO)
    // ==============================
    console.log("\n📊 QA SCORE\n");
    console.log(`Coverage: ${score.coverageScore}%`);
    console.log(`API Quality: ${score.apiQualityScore}%`);
    console.log(`E2E Quality: ${score.e2eQualityScore}%`);
    console.log(`\n🏁 Final Score: ${score.finalScore}/100`);

    console.log("\n🧠 GAPS:");
    console.log(gaps);

    console.log("\n📄 README atualizado com QA Score dinâmico\n");
}

// ================= HELPERS =================

function getBadgeColor(score: number) {
    if (score >= 90) return "brightgreen";
    if (score >= 70) return "yellow";
    return "red";
}