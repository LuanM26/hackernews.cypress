import fs from "fs";
import path from "path";

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

export function generateDashboard(
    coverage: CoverageItem[],
    quality: QualityItem[],
    score: Score
) {
    const filePath = path.resolve("qa-report.html");

    const getColor = (value: number) => {
        if (value >= 90) return "#22c55e";
        if (value >= 70) return "#eab308";
        return "#ef4444";
    };

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>QA Dashboard</title>
  <style>
    body {
      font-family: Arial;
      background: #0f172a;
      color: #fff;
      padding: 20px;
    }

    h1 {
      text-align: center;
    }

    .card {
      background: #1e293b;
      padding: 20px;
      border-radius: 10px;
      margin: 20px 0;
    }

    .bar {
      height: 20px;
      border-radius: 5px;
      margin-top: 5px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    td, th {
      padding: 10px;
      border-bottom: 1px solid #334155;
      text-align: left;
    }

    .good { color: #22c55e; }
    .bad { color: #ef4444; }
  </style>
</head>

<body>

<h1>📊 QA Dashboard</h1>

<div class="card">
  <h2>🏁 Final Score: ${score.finalScore}/100</h2>
</div>

<div class="card">
  <h3>Coverage (${score.coverageScore}%)</h3>
  <div class="bar" style="width:${score.coverageScore}%; background:${getColor(score.coverageScore)}"></div>

  <h3>API Quality (${score.apiQualityScore}%)</h3>
  <div class="bar" style="width:${score.apiQualityScore}%; background:${getColor(score.apiQualityScore)}"></div>

  <h3>E2E Quality (${score.e2eQualityScore}%)</h3>
  <div class="bar" style="width:${score.e2eQualityScore}%; background:${getColor(score.e2eQualityScore)}"></div>
</div>

<div class="card">
  <h2>📡 Coverage</h2>
  <p>Total: ${coverage.length}</p>
  <p>Covered: ${coverage.filter(c => c.covered).length}</p>
</div>

<div class="card">
  <h2>🧪 Test Quality</h2>
  <table>
    <tr>
      <th>File</th>
      <th>Status</th>
      <th>Error</th>
      <th>Pagination</th>
      <th>Schema</th>
    </tr>

    ${quality.map(q => `
      <tr>
        <td>${q.file}</td>
        <td class="${q.hasStatusCheck ? 'good' : 'bad'}">${q.hasStatusCheck ? '✔' : '✖'}</td>
        <td class="${q.hasErrorTest ? 'good' : 'bad'}">${q.hasErrorTest ? '✔' : '✖'}</td>
        <td class="${q.hasPagination ? 'good' : 'bad'}">${q.hasPagination ? '✔' : '✖'}</td>
        <td class="${q.hasSchemaValidation ? 'good' : 'bad'}">${q.hasSchemaValidation ? '✔' : '✖'}</td>
      </tr>
    `).join("")}

  </table>
</div>

</body>
</html>
`;

    fs.writeFileSync(filePath, html);

    console.log("📊 Dashboard gerado: qa-report.html");
}