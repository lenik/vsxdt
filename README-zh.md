# vsxdt

`vsxdt` 是一个用于浏览器自动化与快速 JS 评估的 VS Code 扩展。

## Cycle Proxy

> **代理轮换** · **`vsxdt.toggleProxies`** · **DevTools: Cycle Proxy** · **`Alt+Shift+P`**
>
> 循环切换 VS Code 全局 `http.proxy`：按 `vsxdt.proxyList` 中顺序使用每个代理 URL，再清空代理，周而复始—便于轮换 HTTP(S) 代理而无需反复打开设置。

1. 在 **设置** 中为 **vsxdt** → **Proxy List**（`vsxdt.proxyList`）填写代理地址，每项一行，例如：`http://127.0.0.1:8080`。
2. 执行 **DevTools: Cycle Proxy**，或按 `Alt+Shift+P`（若无键位冲突）。
3. 状态栏约 5 秒显示刚生效的代理，或本轮清空代理时的 `(no proxy)`。

若 `vsxdt.proxyList` 为空，命令会提示先到设置中填写列表。

## 演示

<video src="./screens/screendemo.webm" controls muted autoplay loop playsinline width="800"></video>

## 功能

- **Cycle Proxy**（`vsxdt.toggleProxies`）：
  - 轮换全局 `http.proxy` 与 `vsxdt.proxyList`；详见上文 [Cycle Proxy](#cycle-proxy)。
- **Eval Selection**（`vsxdt.evalSelection`）：
  - 在 `.code.js` 编辑器中执行已选中的 JavaScript（基于 Node `vm`）。
  - 将执行结果以引用块形式追加到选区后方。
- **Input Inject Panel**（`vsxdt.showInputInjectDialog`）：
  - 打开 Webview 面板，通过 CDP 向 Chrome 页面发送按键序列。
  - 使用 CSS 选择器定位可编辑元素，并输出详细日志。

## 运行要求

- 建议 Node.js 20+
- [pnpm](https://pnpm.io/)
- 启用远程调试端口的 Chrome / Chromium，例如：

```bash
google-chrome --remote-debugging-port=9222
```

## 扩展配置

- `vsxdt.chromeHost`（默认：`127.0.0.1`）
- `vsxdt.chromePort`（默认：`9222`）
- `vsxdt.targetUrlIncludes`（默认：空字符串）
- `vsxdt.maxResultLength`（默认：`20000`）
- `vsxdt.proxyList`（默认：`[]`）：由 **DevTools: Cycle Proxy** 轮换的代理 URL（写入全局 `http.proxy`；至少需要一项）。

## 开发

安装依赖：

```bash
pnpm install
```

构建：

```bash
pnpm run compile
```

监听模式：

```bash
pnpm run watch
```

打包 VSIX：

```bash
pnpm run package
```

## 使用方式

1. （可选）若使用 `vsxdt.proxyList`，可执行 **DevTools: Cycle Proxy**（`Alt+Shift+P`）轮换全局 `http.proxy`—见上文 [Cycle Proxy](#cycle-proxy)。
2. 打开 `.code.js` 文件。
3. 选中 JavaScript 后按 `F5`（或执行 **DevTools: Eval Selection**）。
4. 执行 **DevTools: Show Input Inject Dialog** 打开面板。
5. 输入：
   - CSS 选择器
   - 按键 JSON 数组，例如：`["h","e","l","l","o","Enter"]`

## Debian 打包

Debian 元数据位于 `debian/`。

构建命令：

```bash
dpkg-buildpackage -us -uc
```

## 许可证

Copyright (C) 2026 Lenik <vsxdt@bodz.net>

采用 **AGPL-3.0-or-later** 许可。  
完整文本及项目补充条款见 `LICENSE`。
