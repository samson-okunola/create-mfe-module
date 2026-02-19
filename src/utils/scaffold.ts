import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import path from 'path';
import ejs from 'ejs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface TemplateVariables {
  name: string;
  port: number;
  shellTarget?: string;
  [key: string]: string | number | undefined;
}

export async function renderDir(
  templateName: 'shell' | 'module',
  destDir: string,
  variables: TemplateVariables
): Promise<void> {
  const templateDir = path.resolve(__dirname, '..', 'templates', templateName);

  if (!await fs.pathExists(templateDir)) {
    throw new Error(`Template directory not found: ${templateDir}`);
  }

  await fs.ensureDir(destDir);
  await copyAndRenderDir(templateDir, destDir, variables);
}

async function copyAndRenderDir(
  srcDir: string,
  destDir: string,
  variables: TemplateVariables
): Promise<void> {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    let destName = entry.name;

    // Remove .ejs extension from destination filename
    if (destName.endsWith('.ejs')) {
      destName = destName.slice(0, -4);
    }

    const destPath = path.join(destDir, destName);

    if (entry.isDirectory()) {
      await fs.ensureDir(destPath);
      await copyAndRenderDir(srcPath, destPath, variables);
    } else if (entry.name.endsWith('.ejs')) {
      // Render EJS template
      const content = await fs.readFile(srcPath, 'utf-8');
      const rendered = ejs.render(content, variables);
      await fs.writeFile(destPath, rendered, 'utf-8');
    } else {
      // Copy file as-is
      await fs.copyFile(srcPath, destPath);
    }
  }
}

export function getTemplateDir(templateName: 'shell' | 'module'): string {
  return path.resolve(__dirname, '..', 'templates', templateName);
}
