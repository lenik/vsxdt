# vsxdt

`vsxdt` is a VS Code extension for browser automation and quick JS evaluation while developing.

## Features

- **Eval Selection** (`vsxdt.evalSelection`):
  - Runs selected JavaScript from a `.code.js` editor using Node `vm`.
  - Appends the result directly after the selection as quoted output.
- **Input Inject Panel** (`vsxdt.showInputInjectDialog`):
  - Opens a webview form to send keystroke sequences to a Chrome page over CDP.
  - Targets editable elements matched by a CSS selector and prints verbose logs.

## Requirements

- Node.js 20+ recommended
- [pnpm](https://pnpm.io/)
- Google Chrome / Chromium started with remote debugging, e.g.:

```bash
google-chrome --remote-debugging-port=9222
```

## Extension settings

- `vsxdt.chromeHost` (default: `127.0.0.1`)
- `vsxdt.chromePort` (default: `9222`)
- `vsxdt.targetUrlIncludes` (default: empty)
- `vsxdt.maxResultLength` (default: `20000`)

## Development

Install dependencies:

```bash
pnpm install
```

Build:

```bash
pnpm run compile
```

Watch mode:

```bash
pnpm run watch
```

Package VSIX:

```bash
pnpm run package
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

Copyright (C) 2026 Lenik <vsxdt@bodz.net>

Licensed under **AGPL-3.0-or-later**.  
See `LICENSE` for the full text and supplemental project terms.
