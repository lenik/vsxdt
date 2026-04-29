# vsxdt

`vsxdt` is a VS Code extension for browser automation and quick JS evaluation while developing.

## Cycle Proxy

> **`vsxdt.toggleProxies`** · **DevTools: Cycle Proxy** · **`Alt+Shift+P`**
>
> Cycles VS Code global `http.proxy`: each URL in `vsxdt.proxyList` in order, then no proxy, then repeats—useful for rotating HTTP(S) proxies without opening Settings.

1. Open **Settings** and fill **vsxdt** → **Proxy List** (`vsxdt.proxyList`) with one entry per URL, e.g. `http://127.0.0.1:8080`.
2. Run **DevTools: Cycle Proxy** from the Command Palette, or press `Alt+Shift+P` if not bound elsewhere.
3. The status bar (~5 seconds) shows the proxy just applied or `(no proxy)` when the cycle clears it.

If `vsxdt.proxyList` is empty, the command reminds you to add entries.

## Demo

<video src="./screens/screendemo.webm" controls muted autoplay loop playsinline width="800"></video>

## Features

- **Cycle Proxy** (`vsxdt.toggleProxies`):
  - Rotates global `http.proxy` through `vsxdt.proxyList`, then clears it; see [Cycle Proxy](#cycle-proxy) above.
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
- `vsxdt.proxyList` (default: `[]`): proxy URLs rotated by **DevTools: Cycle Proxy** (sets global `http.proxy`; add at least one entry to use).

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

1. Optionally run **DevTools: Cycle Proxy** (`Alt+Shift+P`) to rotate `http.proxy` if you use `vsxdt.proxyList`—see [Cycle Proxy](#cycle-proxy).
2. Open a `.code.js` file.
3. Select JavaScript and press `F5` (or run **DevTools: Eval Selection**).
4. Run **DevTools: Show Input Inject Dialog** to open the panel.
5. Provide:
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
