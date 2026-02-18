import pc from 'picocolors'
import path from 'path'

import { registerShell } from '../registry/index.js'
import { renderDir } from '../utils/scaffold.js'

interface ShellOptions {
  name: string
  registryRepo: string
  port: number
}

export const scaffoldShell = async ({ name, registryRepo, port }: ShellOptions) => {
  const destDir = path.resolve(process.cwd(), name)

  console.log(pc.cyan(`\nScaffolding shell: ${pc.bold(name)}\n`))

  try {
    await renderDir('shell', destDir, { name, port })
    console.log(pc.green(`Files created at ./${name}`))

    await registerShell(registryRepo, name, port)
    console.log(pc.green(`Shell "${name}" registered in mfe-registry\n`))

    console.log(pc.dim('Next steps:'))
    console.log(pc.dim(`  cd ${name}`))
    console.log(pc.dim('  pnpm install'))
    console.log(pc.dim('  pnpm dev\n'))
  } catch (error) {
    console.error(pc.red(`\nFailed to scaffold shell: ${error instanceof Error ? error.message : String(error)}`))
    process.exit(1)
  }
}