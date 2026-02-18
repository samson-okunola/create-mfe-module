#!/usr/bin/env node
import { Command } from 'commander'

import { scaffoldShell } from './commands/shell.js'
import { scaffoldModule } from './commands/module.js'

const program = new Command()

program
  .name('create-mfe-module')
  .description('Scaffold MFE shells and modules')
  .version('1.0.0')

program
  .option('--shell <name>', 'Create a new MFE shell')
  .option('--module <name>', 'Create a new MFE module')
  .option('--shell-target <name>', 'Shell to register the module under (used with --module)')
  .option('--registry-repo <url>', 'GitHub URL of the mfe-registry repo', process.env.MFE_REGISTRY_REPO)
  .option('--port <number>', 'Dev server port', '3000')
  .action(async (opts) => {
    if (!opts.shell && !opts.module) {
      console.error('Provide either --shell <name> or --module <name>')
      process.exit(1)
    }

    if (opts.shell && opts.module) {
      console.error('Use --shell and --module separately')
      process.exit(1)
    }

    if (!opts.registryRepo) {
      console.error('Missing --registry-repo. Set MFE_REGISTRY_REPO env var or pass it explicitly.')
      process.exit(1)
    }

    if (opts.shell) {
      await scaffoldShell({ name: opts.shell, registryRepo: opts.registryRepo, port: Number(opts.port) })
    }

    if (opts.module) {
      if (!opts.shellTarget) {
        console.error('--module requires --shell-target <shell-name>')
        process.exit(1)
      }
      await scaffoldModule({
        name: opts.module,
        shellTarget: opts.shellTarget,
        registryRepo: opts.registryRepo,
        port: Number(opts.port),
      })
    }
  })

program.parse()