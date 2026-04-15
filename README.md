# vscode-devtools

`vscode-devtools` is a VS Code extension for browser automation and quick JS evaluation while developing.

## Features

- **Eval Selection** (`devtools.evalSelection`):
  - Runs selected JavaScript from a `.code.js` editor using Node `vm`.
  - Appends the result directly after the selection as quoted output.
- **Input Inject Panel** (`devtools.showInputInjectDialog`):
  - Opens a webview form to send keystroke sequences to a Chrome page over CDP.
  - Targets editable elements matched by a CSS selector and prints verbose logs.

## Requirements

- Node.js 20+ recommended
- npm (or pnpm)
- Google Chrome / Chromium started with remote debugging, e.g.:

```bash
google-chrome --remote-debugging-port=9222
```

## Extension settings

- `devtools.chromeHost` (default: `127.0.0.1`)
- `devtools.chromePort` (default: `9222`)
- `devtools.targetUrlIncludes` (default: empty)
- `devtools.maxResultLength` (default: `20000`)

## Development

Install dependencies:

```bash
npm install
```

Build:

```bash
npm run compile
```

Watch mode:

```bash
npm run watch
```

Package VSIX:

```bash
npm run package
```

## Usage

1. Open a `.code.js` file.
2. Select JavaScript and press `F5` (or run **DevTools: Eval Selection**).
3. Run **DevTools: Show Input Inject Dialog** to open the panel.
4. Provide:
   - CSS selector
   - JSON array of keys, e.g. `["h","e","l","l","o","Enter"]`

## Debian packaging

Debian metadata is under `debian/`.

Build package:

```bash
dpkg-buildpackage -us -uc
```

## License

Copyright (C) 2026 Lenik <vscode-devtools@bodz.net>

Licensed under **AGPL-3.0-or-later**.  
See `LICENSE` for the full text and supplemental project terms.
