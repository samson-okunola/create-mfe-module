import pc from 'picocolors';
import path from 'path';
import { registerModule } from '../registry/index.js';
import { renderDir } from '../utils/scaffold.js';
export const scaffoldModule = async ({ name, shellTarget, registryRepo, port }) => {
    const destDir = path.resolve(process.cwd(), name);
    console.log(pc.cyan(`\nScaffolding module: ${pc.bold(name)} -> shell: ${pc.bold(shellTarget)}\n`));
    try {
        await renderDir('module', destDir, { name, shellTarget, port });
        console.log(pc.green(`Files created at ./${name}`));
        await registerModule(registryRepo, name, shellTarget, port);
        console.log(pc.green(`Module "${name}" registered under shell "${shellTarget}" in mfe-registry\n`));
        console.log(pc.dim('Next steps:'));
        console.log(pc.dim(`  cd ${name}`));
        console.log(pc.dim('  pnpm install'));
        console.log(pc.dim('  pnpm dev\n'));
    }
    catch (error) {
        console.error(pc.red(`\nFailed to scaffold module: ${error instanceof Error ? error.message : String(error)}`));
        process.exit(1);
    }
};
//# sourceMappingURL=module.js.map