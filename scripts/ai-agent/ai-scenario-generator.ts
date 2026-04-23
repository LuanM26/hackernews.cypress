export type ScenarioType = "positive" | "negative" | "edge";

export type Scenario = {
    name: string;
    description: string;
    type: ScenarioType;
    request?: {
        query?: string;
        page?: number;
    };
};

export function generateScenarios(endpoint: string): Scenario[] {
    const scenarios: Scenario[] = [];

    // ✅ Cenário de sucesso
    scenarios.push({
        name: "should return successful response",
        description: "Valida resposta 200 com dados válidos",
        type: "positive",
        request: {
            query: "redux",
            page: 0
        }
    });

    // ⚠️ Cenário de busca vazia
    scenarios.push({
        name: "should handle empty search",
        description: "Valida comportamento com query vazia",
        type: "edge",
        request: {
            query: "",
            page: 0
        }
    });

    // ❌ Cenário inválido
    scenarios.push({
        name: "should handle invalid input",
        description: "Valida input inválido",
        type: "negative",
        request: {
            query: "%%%INVALID%%%",
            page: 0
        }
    });

    // 🔄 Paginação
    scenarios.push({
        name: "should validate pagination",
        description: "Valida mudança de página",
        type: "positive",
        request: {
            query: "redux",
            page: 1
        }
    });

    return scenarios;
}