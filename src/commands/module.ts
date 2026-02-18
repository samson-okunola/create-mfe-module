import pc from 'picocolors'
import path from 'path'
import fs from 'fs-extra'

import { registerModule, getRegistryLocalPath } from '../registry/index.js'
import { renderDir } from '../utils/scaffold.js'

interface ModuleOptions {
  name: string
  shellTarget: string
  registryRepo: string
  port: number
}

export const scaffoldModule = async ({ name, shellTarget, registryRepo, port }: ModuleOptions) => {
  const destDir = path.resolve(process.cwd(), name)

  console.log(pc.cyan(`\nScaffolding module: ${pc.bold(name)} -> shell: ${pc.bold(shellTarget)}\n`))

  try {
    await renderDir('module', destDir, { name, shellTarget, port })
    console.log(pc.green(`Files created at ./${name}`))

    await registerModule(registryRepo, name, shellTarget, port)
    console.log(pc.green(`Module "${name}" registered under shell "${shellTarget}" in mfe-registry`))

    // Copy updated registry to shell's public folder if shell exists locally
    const registryPath = path.join(getRegistryLocalPath(registryRepo), 'mfe-registry.json')
    const shellPublicRegistry = path.join(process.cwd(), shellTarget, 'public', 'mfe-registry.json')

    if (await fs.pathExists(path.join(process.cwd(), shellTarget))) {
      await fs.copy(registryPath, shellPublicRegistry)
      console.log(pc.green(`Registry updated in ${shellTarget}/public/mfe-registry.json\n`))
    } else {
      console.log(pc.yellow(`\nNote: Shell "${shellTarget}" not found locally. Copy the registry manually:`))
      console.log(pc.dim(`  cp ${registryPath} <shell-path>/public/mfe-registry.json\n`))
    }

    console.log(pc.dim('Next steps:'))
    console.log(pc.dim(`  cd ${name}`))
    console.log(pc.dim('  pnpm install'))
    console.log(pc.dim('  pnpm dev\n'))
  } catch (error) {
    console.error(pc.red(`\nFailed to scaffold module: ${error instanceof Error ? error.message : String(error)}`))
    process.exit(1)
  }
}