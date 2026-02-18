import type { MfeRegistry } from './types.js';
export declare function getRegistryLocalPath(registryRepo: string): string;
export declare function fetchRegistry(registryRepo: string): Promise<MfeRegistry>;
export declare function getShellConfig(registryRepo: string, shellName: string): Promise<MfeRegistry['shells'][string] | undefined>;
//# sourceMappingURL=fetch.d.ts.map