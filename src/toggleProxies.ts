import * as vscode from "vscode";

const STATE_KEY_PROXY_CYCLE_INDEX = "vsxdt.proxyCycleIndex";

function getProxies(): string[] {
  const raw = vscode.workspace.getConfiguration("vsxdt").get<string[]>("proxyList", []);
  return raw.map((s) => s.trim()).filter((s) => s.length > 0);
}

/**
 * Advances to the next proxy in `vsxdt.proxyList`, then clears (no proxy), then repeats.
 */
export async function toggleProxies(context: vscode.ExtensionContext): Promise<void> {
  const proxies = getProxies();
  const n = proxies.length;

  if (n === 0) {
    void vscode.window.showWarningMessage(
      "DevTools: add entries to Settings → vsxdt.proxyList before cycling proxies."
    );
    return;
  }

  const states = n + 1;
  let idx = context.globalState.get<number>(STATE_KEY_PROXY_CYCLE_INDEX, 0);
  idx = Number.isFinite(idx) ? Math.abs(Math.trunc(idx)) % states : 0;

  const http = vscode.workspace.getConfiguration("http");
  let label: string;
  if (idx === n) {
    await http.update(
      "proxy",
      "",
      vscode.ConfigurationTarget.Global
    );
    label = "(no proxy)";
  } else {
    const proxy = proxies[idx]!;
    await http.update(
      "proxy",
      proxy,
      vscode.ConfigurationTarget.Global
    );
    label = proxy;
  }

  await context.globalState.update(STATE_KEY_PROXY_CYCLE_INDEX, (idx + 1) % states);

  void vscode.window.setStatusBarMessage(`DevTools proxy: ${label}`, 5000);
}
