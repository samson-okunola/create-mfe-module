export interface TemplateVariables {
    name: string;
    port: number;
    shellTarget?: string;
    [key: string]: string | number | undefined;
}
export declare function renderDir(templateName: 'shell' | 'module', destDir: string, variables: TemplateVariables): Promise<void>;
export declare function getTemplateDir(templateName: 'shell' | 'module'): string;
//# sourceMappingURL=scaffold.d.ts.map