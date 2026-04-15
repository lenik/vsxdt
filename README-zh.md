# vscode-devtools

`vscode-devtools` 是一个用于浏览器自动化与快速 JS 评估的 VS Code 扩展。

## 功能

- **Eval Selection**（`devtools.evalSelection`）：
  - 在 `.code.js` 编辑器中执行已选中的 JavaScript（基于 Node `vm`）。
  - 将执行结果以引用块形式追加到选区后方。
- **Input Inject Panel**（`devtools.showInputInjectDialog`）：
  - 打开 Webview 面板，通过 CDP 向 Chrome 页面发送按键序列。
  - 使用 CSS 选择器定位可编辑元素，并输出详细日志。

## 运行要求

- 建议 Node.js 20+
- npm（或 pnpm）
- 启用远程调试端口的 Chrome / Chromium，例如：

```bash
google-chrome --remote-debugging-port=9222
```

## 扩展配置

- `devtools.chromeHost`（默认：`127.0.0.1`）
- `devtools.chromePort`（默认：`9222`）
- `devtools.targetUrlIncludes`（默认：空字符串）
- `devtools.maxResultLength`（默认：`20000`）

## 开发

安装依赖：

```bash
npm install
```

构建：

```bash
npm run compile
```

监听模式：

```bash
npm run watch
```

打包 VSIX：

```bash
npm run package
```

## 使用方式

1. 打开 `.code.js` 文件。
2. 选中 JavaScript 后按 `F5`（或执行 **DevTools: Eval Selection**）。
3. 执行 **DevTools: Show Input Inject Dialog** 打开面板。
4. 输入：
   - CSS 选择器
   - 按键 JSON 数组，例如：`["h","e","l","l","o","Enter"]`

## Debian 打包

Debian 元数据位于 `debian/`。

构建命令：

```bash
dpkg-buildpackage -us -uc
```

## 许可证

Copyright (C) 2026 Lenik <vscode-devtools@bodz.net>

采用 **AGPL-3.0-or-later** 许可。  
完整文本及项目补充条款见 `LICENSE`。
