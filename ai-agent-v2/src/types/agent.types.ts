// src/types/agent.types.ts

// =============================
// COVERAGE
// =============================
export type Coverage = {
  total: number;
  covered: string[];
  missing: string[];
};

// =============================
// SCENARIO DETAILS
// =============================
export type ScenarioChecks = {
  success: boolean;
  validation: boolean;
  negative: boolean;
  empty: boolean;
};

export type ScenarioAnalysis = Record<string, ScenarioChecks>;

// =============================
// QA SCORE
// =============================
export type QAScore = {
  score: number;
  totalChecks: number;
  passedChecks: number;
  details: ScenarioAnalysis;
};

// =============================
// GAP
// =============================
export type Gap = {
  endpoint: string;
  missing: string[];
};

// =============================
// REPORT
// =============================
export type ReportData = {
  endpoints: string[];
  coverage: Coverage;
  gaps: Gap[];
  qaScore: QAScore;
};

// =============================
// GENERATED TEST TYPE
// =============================
export type TestType = 'api' | 'e2e';

// =============================
// AGENT CONFIG
// =============================
export type AgentConfig = {
  mode: 'safe' | 'full' | 'analyze' | 'generate';
  projectRoot: string;
  cypressPath: string;
};