
<p align="center">
  <img src="https://img.shields.io/badge/QA-100%25-brightgreen?style=for-the-badge" />
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


## 📦 Dependências

### 🔹 Produção

| Pacote | Versão | Descrição |
|--------|--------|----------|
| @cypress/grep | ^6.0.0 | Dependência |
| @eslint/js | ^10.0.1 | Dependência |
| @faker-js/faker | ^10.4.0 | Dados fake |
| cypress | ^15.13.1 | Framework de testes E2E |
| cypress-iframe | ^1.0.1 | Dependência |
| cypress-mailosaur | ^5.0.0 | Dependência |
| eslint | ^10.2.0 | Linting |
| eslint-plugin-cypress | ^6.3.0 | Dependência |
| fs-extra | ^11.3.4 | Dependência |
| glob | ^13.0.6 | Dependência |
| globals | ^17.5.0 | Dependência |

### 🔹 Desenvolvimento

| Pacote | Versão | Descrição |
|--------|--------|----------|
| @types/mocha | ^10.0.10 | Dependência |
| @types/node | ^25.6.0 | Dependência |
| ts-node | ^10.9.2 | Execução TS no Node |
| typescript | ^6.0.2 | Tipagem estática |


---


## 🤖 AI Agent Scripts

| Script | Descrição |
|--------|----------|
| agent-config | Script do agente |
| ai-scenario-generator | Script do agente |
| analyze-existing-tests | Script do agente |
| analyze-failures | Analisa falhas dos testes |
| analyze-test-quality | Avalia qualidade dos testes |
| auto-fix-endpoint | Script do agente |
| compare-coverage | Compara APIs reais com testes |
| coverage-analyzer | Calcula cobertura de endpoints |
| deduplicate-flows | Remove duplicação de fluxos |
| detect-devops | Detecta CI/CD |
| detect-endpoints | Script do agente |
| detect-errors | Identifica erros recorrentes |
| detect-gaps | Script do agente |
| endpoint-validator | Valida endpoints |
| extract-endpoints | Script do agente |
| extract-ui-flow | Extrai fluxo de UI |
| filter-runtime | Filtra requisições reais |
| flow-intelligence | Aplica inteligência ao fluxo |
| flow-utils | Utilidades de fluxo |
| generate-dashboard | Script do agente |
| generate-e2e | Gera testes E2E |
| generate-readme | Gera README automaticamente |
| generate-report | Gera relatório de qualidade |
| generate-tests | Gera testes de API |
| index | Orquestrador do agente |
| qa-score | Calcula QA Score |
| read-existing-e2e | Script do agente |
| read-existing-scenarios | Script do agente |
| read-project | Lê estrutura do projeto |
| selector-utils | Corrige seletores |
| self-heal | Auto-correção de testes |
| test-exists | Script do agente |


---


## 🧠 GAP Analysis

- Empty Search: ✅ OK
- Error Handling: ✅ OK
- Pagination: ✅ OK
- Status Check: ✅ OK
- Uncovered Endpoints: 0

---

## 📡 Cobertura

- Endpoints analisados: 1
- Cobertos: 1

---

## 🧪 Qualidade dos Testes


### C:\hackernews.cypress\cypress\e2e\api\auto-generated.cy.ts

- Status: ✅
- Error: ✅
- Pagination: ✅
- Schema: ✅


### C:\hackernews.cypress\cypress\e2e\tests\auto-generated-e2e.cy.ts

- Status: ✅
- Error: ✅
- Pagination: ✅
- Schema: ✅


### C:\hackernews.cypress\cypress\e2e\tests\pagina.cy.js

- Status: ✅
- Error: ✅
- Pagination: ❌
- Schema: ✅


---

## 🚀 Execução

```bash
npx ts-node scripts/ai-agent/index.ts
```

---

## 👨‍💻 Autor

Luan Macedo
