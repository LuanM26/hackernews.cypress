import fs from "fs";
import path from "path";
import { compareCoverage } from "./compare-coverage";
import { analyzeTestQuality } from "./analyze-test-quality";
import { getApiRequests } from "./filter-runtime";
import { detectDevOps } from "./detect-devops";

// ================= TYPES =================

type ApiRequest = {
    method: string;
    url: string;
};

type Coverage = {
    endpoint: string;
    method: string;
    covered: boolean;
};

type TestQuality = {
    file: string;
    hasStatusCheck: boolean;
    hasErrorTest: boolean;
    hasPagination: boolean;
    hasSchemaValidation: boolean;
};

// ================= HELPERS =================

function replaceSection(content: string, section: string, newData: string) {
    const start = `<!-- AUTO-GENERATED:${section} -->`;
    const end = `<!-- END -->`;

    if (!content.includes(start)) {
        return content + `\n\n${start}\n${newData}\n${end}\n`;
    }

    const regex = new RegExp(`${start}[\\s\\S]*?${end}`, "g");

    return content.replace(regex, `${start}\n${newData}\n${end}`);
}

// ================= STRUCTURE =================

function generateProjectStructure() {
    return `
\`\`\`bash
scripts/
  ai-agent/
    index.ts
    read-project.ts
    coverage-analyzer.ts
    filter-runtime.ts
    compare-coverage.ts
    analyze-test-quality.ts
    extract-ui-flow.ts
    generate-tests.ts
    generate-e2e.ts
    generate-readme.ts

cypress/
  e2e/
    tests/
    api/
\`\`\`
`;
}

// ================= SCRIPTS =================

function generateScriptsDescription() {
    return `
### 🧠 Core
- **index.ts** → Orquestra o agente

### 📊 Análise
- **coverage-analyzer.ts** → Extrai endpoints
- **filter-runtime.ts** → APIs reais
- **compare-coverage.ts** → Coverage real
- **analyze-test-quality.ts** → Qualidade

### 🤖 Geração
- **generate-tests.ts** → API tests
- **generate-e2e.ts** → E2E inteligente

### 📄 Docs
- **generate-readme.ts** → Atualiza README
`;
}

// ================= DEPENDENCIES =================

function getDependencies() {
    const pkgPath = path.resolve(process.cwd(), "package.json");

    if (!fs.existsSync(pkgPath)) {
        return { dependencies: {}, devDependencies: {} };
    }

    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

    return {
        dependencies: pkg.dependencies || {},
        devDependencies: pkg.devDependencies || {},
    };
}

const libDescriptions: Record<string, string> = {
    cypress: "Framework de testes end-to-end",
    typescript: "Tipagem estática",
    axios: "Cliente HTTP",
    dotenv: "Variáveis de ambiente",
    eslint: "Linting",
    prettier: "Formatação",
    "ts-node": "Execução TS no Node",
};

function generateDependenciesSection() {
    const { dependencies, devDependencies } = getDependencies();

    const format = (deps: Record<string, string>) => {
        const entries = Object.entries(deps);

        if (!entries.length) return "_Nenhuma dependência_";

        return entries
            .map(([name, version]) => {
                const v = version.replace(/[\^~]/g, "");
                const desc = libDescriptions[name] || "Biblioteca do projeto";

                return `- **${name} (${v})**
  → ${desc}
  → https://www.npmjs.com/package/${name}`;
            })
            .join("\n\n");
    };

    return `
### 📦 Production
${format(dependencies)}

---

### 🛠 Dev
${format(devDependencies)}
`;
}
const authorSection = generateAuthorSection();
function generateAuthorSection() {
    const name = "Luan Macedo de Jesus Santos Araujo";
    const role = "QA Engineer | Automation | Cypress | AI Agent";
    const github = "https://github.com/LuanM26";
    const linkedin = "www.linkedin.com/in/luan-macedo-a18136152";

    return `
**${name}**

${role}

- GitHub: ${github}
- LinkedIn: ${linkedin}
`;
}

// ================= MAIN =================

export function generateReadme() {
    const coverage: Coverage[] = compareCoverage();
    const quality: TestQuality[] = analyzeTestQuality();
    const apis: ApiRequest[] = getApiRequests();

    const { hasCI, hasCloud } = detectDevOps();

    const readmePath = path.resolve(process.cwd(), "README.md");

    if (!fs.existsSync(readmePath)) {
        fs.writeFileSync(readmePath, "# 🤖 AI QA Agent\n");
    }

    let content = fs.readFileSync(readmePath, "utf-8");

    if (!content || content.length < 10) {
        content = "# 🤖 AI QA Agent\n";
    }

    // ================= SECTIONS =================

    const about = `
Projeto de automação com agente inteligente que:

- Gera testes automaticamente
- Analisa cobertura real
- Avalia qualidade
- Atualiza documentação
`;

    const devops = `
${hasCI ? "✅ CI/CD detectado" : "❌ CI/CD não detectado"}

${hasCloud ? "☁️ Cypress Cloud ativo" : "❌ Cypress Cloud não detectado"}
`;

    const apisSection =
        apis.length > 0
            ? apis.map(a => `- ${a.method} ${a.url}`).join("\n")
            : "_Sem APIs_";

    const total = coverage.length;
    const covered = coverage.filter(c => c.covered).length;
    const percent = total ? Math.round((covered / total) * 100) : 0;

    const coverageSection = `
- Total: ${total}
- Covered: ${covered}
- Coverage: ${percent}%
`;

    const qualitySection = quality
        .map(q => `
### ${q.file}
- Status: ${q.hasStatusCheck ? "✅" : "❌"}
- Error: ${q.hasErrorTest ? "✅" : "❌"}
- Pagination: ${q.hasPagination ? "✅" : "❌"}
- Schema: ${q.hasSchemaValidation ? "✅" : "❌"}
`)
        .join("\n");

    const structure = generateProjectStructure();
    const scripts = generateScriptsDescription();
    const deps = generateDependenciesSection();

    // ================= APPLY =================

    content = replaceSection(content, "ABOUT", about);
    content = replaceSection(content, "DEVOPS", devops);
    content = replaceSection(content, "APIS", apisSection);
    content = replaceSection(content, "COVERAGE", coverageSection);
    content = replaceSection(content, "QUALITY", qualitySection);
    content = replaceSection(content, "STRUCTURE", structure);
    content = replaceSection(content, "SCRIPTS", scripts);
    content = replaceSection(content, "DEPENDENCIES", deps);
    content = replaceSection(content, "AUTHOR", authorSection);

    fs.writeFileSync(readmePath, content);

    console.log("📄 README atualizado (versão final completa)");
}