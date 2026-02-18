import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { simpleGit } from 'simple-git';
import type { MfeRegistry } from './types.js';
import { DEFAULT_REGISTRY } from './types.js';

const REGISTRY_FILENAME = 'mfe-registry.json';

export function getRegistryLocalPath(registryRepo: string): string {
  if (!registryRepo.startsWith('http') && !registryRepo.startsWith('git@')) {
    return path.resolve(registryRepo);
  }

  const hash = Buffer.from(registryRepo).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
  return path.join(os.tmpdir(), 'mfe-registry', hash);
}

export async function fetchRegistry(registryRepo: string): Promise<MfeRegistry> {
  const localPath = getRegistryLocalPath(registryRepo);
  const registryFile = path.join(localPath, REGISTRY_FILENAME);

  if (!registryRepo.startsWith('http') && !registryRepo.startsWith('git@')) {
    await fs.ensureDir(localPath);

    if (await fs.pathExists(registryFile)) {
      const content = await fs.readFile(registryFile, 'utf-8');
      return JSON.parse(content) as MfeRegistry;
    }

    await fs.writeJSON(registryFile, DEFAULT_REGISTRY, { spaces: 2 });
    return DEFAULT_REGISTRY;
  }

  const git = simpleGit();

  if (await fs.pathExists(path.join(localPath, '.git'))) {
    const repoGit = simpleGit(localPath);
    await repoGit.pull();
  } else {
    await fs.ensureDir(path.dirname(localPath));
    await git.clone(registryRepo, localPath);
  }

  if (await fs.pathExists(registryFile)) {
    const content = await fs.readFile(registryFile, 'utf-8');
    return JSON.parse(content) as MfeRegistry;
  }

  return DEFAULT_REGISTRY;
}

export async function getShellConfig(registryRepo: string, shellName: string): Promise<MfeRegistry['shells'][string] | undefined> {
  const registry = await fetchRegistry(registryRepo);
  return registry.shells[shellName];
}
