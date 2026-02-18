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

export const DEFAULT_REGISTRY: MfeRegistry = {
  version: '1.0.0',
  shells: {}
};
