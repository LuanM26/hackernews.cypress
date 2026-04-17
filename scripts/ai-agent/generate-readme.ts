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
        "analyze-failures": "Analisa falhas dos testes para aprendizado do agente",
        "analyze-test-quality": "Avalia qualidade dos testes",
        "compare-coverage": "Compara APIs reais com testes",
        "coverage-analyzer": "Calcula cobertura de endpoints",
        "deduplicate-flows": "Remove duplicação de fluxos de UI",
        "detect-devops": "Detecta integração CI/CD",
        "detect-errors": "Identifica erros recorrentes",
        "endpoint-validator": "Valida endpoints reais",
        "extract-ui-flow": "Extrai fluxo de interação do usuário",
        "filter-runtime": "Filtra requisições reais capturadas",
        "flow-intelligence": "Aplica inteligência aos fluxos",
        "flow-utils": "Utilidades de manipulação de fluxo",
        "generate-e2e": "Gera testes E2E automaticamente",
        "generate-readme": "Gera este README automaticamente",
        "generate-report": "Gera relatório final de qualidade",
        "generate-tests": "Gera novos testes automaticamente",
        "index": "Orquestrador principal do agente",
        "read-project": "Lê estrutura de testes do projeto",
        "selector-utils": "Corrige seletores automaticamente",
        "self-heal": "Aplica auto-correção de testes",
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
        cypress: "Framework de testes end-to-end",
        typescript: "Superset do JavaScript com tipagem",
        "ts-node": "Execução de TypeScript no Node.js",
        "@faker-js/faker": "Geração de dados fake para testes",
        eslint: "Análise e padronização de código",
        prettier: "Formatação automática de código",
    };

    return map[name] || "Dependência do projeto";
}

function generateDependenciesSection() {
    const { deps, devDeps, raw } = getDependencies();

    if (!deps.length && !devDeps.length) return "";

    return `
## 📦 Dependências

### 🔹 Produção

| Pacote | Versão | Descrição |
|--------|--------|----------|
${deps
            .map(d => `| ${d} | ${raw.dependencies[d]} | ${describeDependency(d)} |`)
            .join("\n")}

### 🔹 Desenvolvimento

| Pacote | Versão | Descrição |
|--------|--------|----------|
${devDeps
            .map(d => `| ${d} | ${raw.devDependencies[d]} | ${describeDependency(d)} |`)
            .join("\n")}
`;
}

// ================= MAIN =================

export function generateReadme() {
    const scriptsSection = generateScriptsSection();
    const dependenciesSection = generateDependenciesSection();

    const content = `
<p align="center">
  <img src="https://img.shields.io/badge/Cypress-Tests-brightgreen?style=for-the-badge&logo=cypress" />
  <img src="https://img.shields.io/badge/CI-GitHub%20Actions-blue?style=for-the-badge&logo=githubactions" />
  <img src="https://img.shields.io/badge/AI-QA%20Agent-black?style=for-the-badge" />
</p>

# 🚀 Cypress AI Automation Project

Projeto de automação com Cypress evoluído para um **Agente Inteligente de QA**, capaz de gerar, analisar e corrigir testes automaticamente.

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

## 🧠 Capacidades do Agente

- ✔ Geração automática de testes E2E
- ✔ Captura de APIs reais
- ✔ Análise de cobertura
- ✔ Análise de qualidade
- ✔ Extração de fluxo de UI
- ✔ Deduplicação inteligente
- ✔ Self-healing
- ✔ Geração automática de README

---

## 📊 Integrações

- ✔ CI/CD com GitHub Actions
- ✔ Cypress Cloud integrado

---

## 🚀 Execução

### Rodar testes

\`\`\`bash
npx cypress run
\`\`\`

### Rodar agente

\`\`\`bash
npx ts-node scripts/ai-agent/index.ts
\`\`\`

---

## 👨‍💻 Responsável

**Luan Macedo de Jesus Santos Araujo**

---

## 🧠 Visão

Evolução da automação tradicional para um modelo de QA inteligente baseado em dados, comportamento e auto-aprendizado.
`;

    fs.writeFileSync("README.md", content);

    console.log("📄 README atualizado com scripts e dependências");
}