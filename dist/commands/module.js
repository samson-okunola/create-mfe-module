import pc from 'picocolors';
import path from 'path';
import fs from 'fs-extra';
import { renderDir } from '../utils/scaffold.js';
export const scaffoldModule = async ({ name, shellTarget, port }) => {
    const destDir = path.resolve(process.cwd(), name);
    console.log(pc.cyan(`\nScaffolding module: ${pc.bold(name)}${shellTarget ? ` -> shell: ${pc.bold(shellTarget)}` : ''}\n`));
    try {
        await renderDir('module', destDir, { name, shellTarget: shellTarget || '', port });
        console.log(pc.green(`Files created at ./${name}`));
        const importMapEntry = `"${name}": "http://localhost:${port}/assets/remoteEntry.js"`;
        // If shell exists locally, update its import-map.json
        if (shellTarget) {
            const shellImportMapPath = path.join(process.cwd(), shellTarget, 'public', 'import-map.json');
            if (await fs.pathExists(shellImportMapPath)) {
                const importMap = await fs.readJSON(shellImportMapPath);
                importMap.imports[name] = `http://localhost:${port}/assets/remoteEntry.js`;
                await fs.writeJSON(shellImportMapPath, importMap, { spaces: 2 });
                console.log(pc.green(`\nImport map updated in ${shellTarget}/public/import-map.json`));
            }
            else {
                console.log(pc.yellow(`\nShell "${shellTarget}" not found locally.`));
                console.log(pc.dim(`Add this entry to your shell's public/import-map.json:`));
                console.log(pc.white(`  ${importMapEntry}\n`));
            }
        }
        else {
            console.log(pc.dim(`\nAdd this entry to your shell's public/import-map.json:`));
            console.log(pc.white(`  ${importMapEntry}\n`));
        }
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