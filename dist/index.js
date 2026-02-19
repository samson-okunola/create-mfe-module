#!/usr/bin/env node
import { Command } from 'commander';
import { scaffoldShell } from './commands/shell.js';
import { scaffoldModule } from './commands/module.js';
const program = new Command();
program
    .name('create-mfe-module')
    .description('Scaffold MFE shells and modules')
    .version('1.0.0');
program
    .option('--shell <name>', 'Create a new MFE shell')
    .option('--module <name>', 'Create a new MFE module')
    .option('--shell-target <name>', 'Shell to update import map for (used with --module)')
    .option('--port <number>', 'Dev server port', '3000')
    .action(async (opts) => {
    if (!opts.shell && !opts.module) {
        console.error('Provide either --shell <name> or --module <name>');
        process.exit(1);
    }
    if (opts.shell && opts.module) {
        console.error('Use --shell and --module separately');
        process.exit(1);
    }
    if (opts.shell) {
        await scaffoldShell({ name: opts.shell, port: Number(opts.port) });
    }
    if (opts.module) {
        await scaffoldModule({
            name: opts.module,
            shellTarget: opts.shellTarget,
            port: Number(opts.port),
        });
    }
});
program.parse();
//# sourceMappingURL=index.js.map