import fs from 'fs-extra';
import path from 'path';
import { simpleGit } from 'simple-git';
import { fetchRegistry, getRegistryLocalPath } from './fetch.js';
import type { MfeRegistry } from './types.js';

const REGISTRY_FILENAME = 'mfe-registry.json';

async function saveRegistry(registryRepo: string, registry: MfeRegistry): Promise<void> {
  const localPath = getRegistryLocalPath(registryRepo);
  const registryFile = path.join(localPath, REGISTRY_FILENAME);

  await fs.writeJSON(registryFile, registry, { spaces: 2 });

  if (registryRepo.startsWith('http') || registryRepo.startsWith('git@')) {
    const git = simpleGit(localPath);
    await git.add(REGISTRY_FILENAME);
    await git.commit(`Update MFE registry`);
    await git.push();
  }
}

export async function registerShell(
  registryRepo: string,
  name: string,
  port: number,
  gitUrl?: string
): Promise<void> {
  const registry = await fetchRegistry(registryRepo);

  if (registry.shells[name]) {
    throw new Error(`Shell "${name}" already exists in the registry`);
  }

  registry.shells[name] = {
    port,
    modules: {}
  };

  await saveRegistry(registryRepo, registry);
}

export async function registerModule(
  registryRepo: string,
  name: string,
  shellTarget: string,
  port: number,
  gitUrl?: string
): Promise<void> {
  const registry = await fetchRegistry(registryRepo);

  const shell = registry.shells[shellTarget];
  if (!shell) {
    throw new Error(`Shell "${shellTarget}" not found in the registry. Create the shell first.`);
  }

  if (shell.modules[name]) {
    throw new Error(`Module "${name}" already exists under shell "${shellTarget}"`);
  }

  shell.modules[name] = {
    url: `http://localhost:${port}`,
    entry: '/assets/remoteEntry.js'
  };

  await saveRegistry(registryRepo, registry);
}

export async function updateModuleUrl(
  registryRepo: string,
  shellName: string,
  moduleName: string,
  url: string
): Promise<void> {
  const registry = await fetchRegistry(registryRepo);

  const shell = registry.shells[shellName];
  if (!shell) {
    throw new Error(`Shell "${shellName}" not found in the registry`);
  }

  const module = shell.modules[moduleName];
  if (!module) {
    throw new Error(`Module "${moduleName}" not found under shell "${shellName}"`);
  }

  module.url = url;
  await saveRegistry(registryRepo, registry);
}
