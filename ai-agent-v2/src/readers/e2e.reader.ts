// src/readers/e2e.reader.ts

import * as fs from 'fs';
import * as glob from 'glob';
import path from 'path';
import { getConfig } from '../config/agent.config';

export function readE2ETests() {

  const config = getConfig();

  const fullPath = path.join(config.projectRoot, config.cypressPath);
  const normalizedPath = fullPath.replace(/\\/g, '/');

  let files = glob.sync(`${normalizedPath}/**/*.cy.{js,ts}`);

  if (config.mode === 'safe') {
    files = files.filter(file => !file.includes('generated'));
  }

  console.log(`📂 Modo: ${config.mode}`);
  console.log('📂 Caminho buscado:', normalizedPath);
  console.log('🔍 Arquivos encontrados:', files);

  return files.map((file) => ({
    file,
    content: fs.readFileSync(file, 'utf-8')
  }));
}