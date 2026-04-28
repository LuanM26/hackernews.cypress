#!/usr/bin/env node

import { runAgent } from '../core/engine';

// 🧠 parser robusto
function parseArgs() {
  const args = process.argv.slice(2);

  const result: Record<string, string> = {};

  args.forEach((arg, index) => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.split('=');
      result[key.replace('--', '')] = value || args[index + 1];
    }
  });

  return result;
}

const args = parseArgs();

// 🔥 aplica modo corretamente
if (args.mode) {
  process.env.AGENT_MODE = args.mode;
}

runAgent();