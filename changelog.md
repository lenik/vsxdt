# Changelog

> **Generated:** `2026-04-29 06:32 UTC`
>
> **Recipe:** `make changelog` · generator: [`scripts/log2md`](scripts/log2md).
>
> **Refs:** `88ea3ba` · branch `master` · latest commit date **2026-04-29**.
>
> **Working tree:** `/home/lenik/tasks/cursor/archive/vsxdt`

| | |
| :--- | :--- |
| Commits (ancestors of HEAD) | 4 |
| Distinct authors (`shortlog -sn` rows) | 2 |
| Remote (`origin`) | https://github.com/lenik/vsxdt |
| Commits in this changelog | 4 |

---

## Contents

- [April 2026](#april-2026)

---

## History


### April 2026

- **2026-04-29** [**88ea3bae1059**](https://github.com/lenik/vsxdt/commit/88ea3bae105922bda587cc7a5ca8cf0e4c8457cd) — Change demo video to a link — lenik

    Updated demo section to link to video asset.

---

**v1.0.0**

- **2026-04-29** [**34da2264106f**](https://github.com/lenik/vsxdt/commit/34da2264106f20b0b006a16277bf5813de344f90) — Improve docs presentation and add reusable git-log changelog generator. — Lenik

    This updates README/README-zh to foreground Cycle Proxy and demo media, wires the extension icon in package metadata, and introduces a reusable scripts/log2md + Makefile changelog workflow that renders full commit subjects/bodies into readable markdown from VCS history.

---

**v0.0.1**

- **2026-04-29** [**2d348c6af474**](https://github.com/lenik/vsxdt/commit/2d348c6af47457b9ce218bb16f1f6ad0795f59c7) — Build and package as a VS Code extension; drop Meson/Debian — Lenik

    Replace the Meson/Debian packaging path with npm/esbuild:

    - Add esbuild.js and point package.json main at dist/extension.js; refresh scripts and vscode engine.

    - Remove meson.build and debian/* (changelog, control, copyright, rules).

    - Add .vscodeignore, launch.json, and tasks.json for develop/build/publish workflows.

    - Add screens/screendemo.webm for docs.

    Extension behaviour:

    - Register DevTools: Cycle Proxy (vsxdt.toggleProxies) with toggleProxies.ts.

    - Add codejs-api.d.ts; extend CDP, evalSelection, inputInject, panel; tune tsconfig.

    - Update README (en/zh) and LICENSE to match the extension-centric layout.
- **2026-04-15** [**e90740d51e58**](https://github.com/lenik/vsxdt/commit/e90740d51e589b09d24938306bb226e732d75f7e) — Initialize VS Code DevTools extension with build, packaging, and documentation baseline. — Lenik

    This first commit establishes a working TypeScript-based VS Code extension that evaluates selected JavaScript from .code.js files and provides a Chrome CDP-backed input injection panel, while also wiring strict compilation and packaging to produce distributable VSIX artifacts.

    It includes refreshed English/Chinese READMEs aligned to actual extension behavior, Debian metadata updates for Node/TypeScript build flow, repository metadata improvements for GitHub/vsce, and local typing/configuration fixes required for clean compile/package execution under pnpm.

---

> **Newest in this log:** `88ea3bae1059` — Change demo video to a link

