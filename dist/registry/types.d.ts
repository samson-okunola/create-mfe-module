export interface ModuleConfig {
    url: string;
    entry: string;
}
export interface ShellConfig {
    port: number;
    modules: Record<string, ModuleConfig>;
}
export interface MfeRegistry {
    version: string;
    shells: Record<string, ShellConfig>;
}
export declare const DEFAULT_REGISTRY: MfeRegistry;
//# sourceMappingURL=types.d.ts.map