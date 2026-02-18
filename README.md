# create-mfe-module

CLI tool to scaffold Micro Frontend (MFE) shells and modules using Vite, React, Module Federation, and Tailwind CSS.

## Features

- **Shell (Host)**: Creates a Module Federation host application that dynamically loads remote modules
- **Module (Remote)**: Creates a Module Federation remote that exposes a single component
- **Registry**: Centralized JSON registry to manage shell-module relationships
- **Polyrepo Ready**: Each shell/module is a standalone project

## Installation

```bash
npm install -g @pablo-clueless/create-mfe-module
```

Or use directly with npx:

```bash
npx @pablo-clueless/create-mfe-module --shell myapp --registry-repo ./registry
```

## Usage

### Create a Shell (Host Application)

```bash
npx create-mfe-module --shell <name> --registry-repo <path> [--port <number>]
```

**Example:**

```bash
npx create-mfe-module --shell converge --registry-repo ./registry --port 3000
```

This creates:
- A new directory `converge/` with a Vite + React + Tailwind app
- Module Federation host configuration
- Dynamic module loading from the registry
- React Router setup

### Create a Module (Remote Application)

```bash
npx create-mfe-module --module <name> --shell-target <shell> --registry-repo <path> [--port <number>]
```

**Example:**

```bash
npx create-mfe-module --module finance --shell-target converge --registry-repo ./registry --port 3001
```

This creates:
- A new directory `finance/` with a Vite + React + Tailwind app
- Module Federation remote configuration exposing `./Module`
- Internal React Router for module-specific routes
- Registers the module in the registry under the target shell

## Options

| Option | Description | Required |
|--------|-------------|----------|
| `--shell <name>` | Create a new MFE shell | Yes (or --module) |
| `--module <name>` | Create a new MFE module | Yes (or --shell) |
| `--shell-target <name>` | Shell to register the module under | Required with --module |
| `--registry-repo <path>` | Path to registry directory (local) or Git URL | Yes |
| `--port <number>` | Dev server port (default: 3000) | No |

You can also set the registry via environment variable:

```bash
export MFE_REGISTRY_REPO=./registry
npx create-mfe-module --shell myapp
```

## Registry

The registry is a JSON file (`mfe-registry.json`) that tracks all shells and their modules:

```json
{
  "version": "1.0.0",
  "shells": {
    "converge": {
      "port": 3000,
      "modules": {
        "finance": {
          "url": "http://localhost:3001",
          "entry": "/assets/remoteEntry.js"
        },
        "hr": {
          "url": "http://localhost:3002",
          "entry": "/assets/remoteEntry.js"
        }
      }
    }
  }
}
```

### Local Registry

For local development, use a local path:

```bash
npx create-mfe-module --shell myapp --registry-repo ./registry
```

### Remote Registry (Git)

For team collaboration, use a Git repository:

```bash
npx create-mfe-module --shell myapp --registry-repo https://github.com/your-org/mfe-registry.git
```

The CLI will clone/pull the repo, update the registry, and push changes.

## Running the Apps

### Start a Shell

```bash
cd converge
pnpm install
pnpm dev
```

The shell runs on the configured port (default: 3000) and loads modules from the registry.

### Start a Module

```bash
cd finance
pnpm install
pnpm dev
```

The module runs on its configured port and exposes `./Module` via Module Federation.

### Full Stack Development

Run both shell and modules simultaneously:

```bash
# Terminal 1 - Shell
cd converge && pnpm dev

# Terminal 2 - Module
cd finance && pnpm dev
```

Navigate to `http://localhost:3000` to see the shell with loaded modules.

## Project Structure

### Shell

```
converge/
├── src/
│   ├── main.tsx          # Entry point (async bootstrap)
│   ├── bootstrap.tsx     # React root setup
│   ├── App.tsx           # Main app with dynamic module loading
│   └── index.css         # Tailwind styles
├── vite.config.ts        # Module Federation host config
├── tailwind.config.js
└── package.json
```

### Module

```
finance/
├── src/
│   ├── main.tsx          # Entry point
│   ├── App.tsx           # Local dev wrapper
│   ├── Module.tsx        # Exposed component (./Module)
│   ├── pages/
│   │   └── Home.tsx      # Module pages
│   └── index.css         # Tailwind styles
├── vite.config.ts        # Module Federation remote config
├── tailwind.config.js
└── package.json
```

## Module Federation Configuration

### Shell (Host)

```typescript
federation({
  name: 'converge',
  remotes: {
    // Modules loaded dynamically from registry
  },
  shared: ['react', 'react-dom', 'react-router-dom']
})
```

### Module (Remote)

```typescript
federation({
  name: 'finance',
  filename: 'remoteEntry.js',
  exposes: {
    './Module': './src/Module.tsx'
  },
  shared: ['react', 'react-dom', 'react-router-dom']
})
```

## Production Deployment

1. **Build each app:**
   ```bash
   cd converge && pnpm build
   cd finance && pnpm build
   ```

2. **Update registry URLs** to production URLs:
   ```json
   {
     "finance": {
       "url": "https://finance.example.com",
       "entry": "/assets/remoteEntry.js"
     }
   }
   ```

3. **Deploy** each app to its own domain/subdomain

4. **Serve the registry** as a static JSON file accessible by the shell

## Development

### Building the CLI

```bash
npm install
npm run build
```

### Testing Locally

```bash
node dist/index.js --shell test-shell --registry-repo ./test-registry --port 3000
```

### Publishing

The package is published to GitHub Packages via GitHub Actions:

1. Create a new release on GitHub
2. The workflow automatically builds and publishes

## License

ISC
