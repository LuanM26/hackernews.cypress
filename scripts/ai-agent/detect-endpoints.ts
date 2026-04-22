type Endpoint = {
    method: string;
    url: string;
};

export function getTestEndpoints(): Endpoint[] {
    // 🔥 você pode evoluir isso depois (parse real dos testes)
    // por enquanto, versão simples baseada no seu projeto

    return [
        { method: "GET", url: "**/search*" }
    ];
}