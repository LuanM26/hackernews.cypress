// src/config/agent.config.ts

import path from 'path';

export type AgentMode = 'safe' | 'full' | 'generate' | 'analyze';

export function getConfig() {
  return {
    mode: (process.env.AGENT_MODE as AgentMode) || 'safe',
    projectRoot: require('path').resolve(__dirname, '../../../'),
    cypressPath: 'cypress/e2e'
  };
}