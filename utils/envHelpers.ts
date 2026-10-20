// utils/envHelper.ts
import fs from 'fs';
import path from 'path';

function parseEnv(filePath = '.env'): Record<string, string> {
  const fullPath = path.resolve(process.cwd(), filePath);
  const envConfig: Record<string, string> = {};

  if (!fs.existsSync(fullPath)) {
    return envConfig;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, '');

    if (key) {
      envConfig[key] = value;
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  }

  return envConfig;
}

export const ENV = parseEnv();