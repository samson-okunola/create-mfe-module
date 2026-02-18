import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { simpleGit } from 'simple-git';
import { DEFAULT_REGISTRY } from './types.js';
const REGISTRY_FILENAME = 'mfe-registry.json';
export function getRegistryLocalPath(registryRepo) {
    // If it's a local path, use it directly
    if (!registryRepo.startsWith('http') && !registryRepo.startsWith('git@')) {
        return path.resolve(registryRepo);
    }
    // For remote repos, use a temp directory based on the repo URL hash
    const hash = Buffer.from(registryRepo).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
    return path.join(os.tmpdir(), 'mfe-registry', hash);
}
export async function fetchRegistry(registryRepo) {
    const localPath = getRegistryLocalPath(registryRepo);
    const registryFile = path.join(localPath, REGISTRY_FILENAME);
    // If it's a local path
    if (!registryRepo.startsWith('http') && !registryRepo.startsWith('git@')) {
        await fs.ensureDir(localPath);
        if (await fs.pathExists(registryFile)) {
            const content = await fs.readFile(registryFile, 'utf-8');
            return JSON.parse(content);
        }
        // Create default registry if doesn't exist
        await fs.writeJSON(registryFile, DEFAULT_REGISTRY, { spaces: 2 });
        return DEFAULT_REGISTRY;
    }
    // For remote repos, clone or pull
    const git = simpleGit();
    if (await fs.pathExists(path.join(localPath, '.git'))) {
        // Pull latest changes
        const repoGit = simpleGit(localPath);
        await repoGit.pull();
    }
    else {
        // Clone the repo
        await fs.ensureDir(path.dirname(localPath));
        await git.clone(registryRepo, localPath);
    }
    if (await fs.pathExists(registryFile)) {
        const content = await fs.readFile(registryFile, 'utf-8');
        return JSON.parse(content);
    }
    return DEFAULT_REGISTRY;
}
export async function getShellConfig(registryRepo, shellName) {
    const registry = await fetchRegistry(registryRepo);
    return registry.shells[shellName];
}
//# sourceMappingURL=fetch.js.map