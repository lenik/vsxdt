import * as vscode from "vscode";
import { inputInject } from "./inputInject";

export class InputInjectPanel {
  private panel: vscode.WebviewPanel | undefined;

  public show(context: vscode.ExtensionContext) {
    if (this.panel) {
      this.panel.reveal(vscode.ViewColumn.Beside);
      return;
    }

    this.panel = vscode.window.createWebviewPanel(
      "devtoolsInputInject",
      "Input Inject",
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    this.panel.webview.html = this.getHtml();

    this.panel.webview.onDidReceiveMessage(async (msg) => {
      if (msg.type === "run") {
        const selector = String(msg.selector ?? "").trim();
        const inputsRaw = String(msg.inputs ?? "").trim();

        let inputs: string[];
        try {
          inputs = JSON.parse(inputsRaw);
          if (!Array.isArray(inputs) || !inputs.every(x => typeof x === "string")) {
            throw new Error("inputs must be string[]");
          }
        } catch (err) {
          this.postMessage({
            type: "done",
            ok: false,
            logs: [`Invalid inputs JSON: ${err instanceof Error ? err.message : String(err)}`]
          });
          return;
        }

        this.postMessage({ type: "running" });

        try {
          const result = await inputInject(selector, inputs);
          this.postMessage({
            type: "done",
            ok: result.ok,
            logs: result.logs
          });
        } catch (err) {
          this.postMessage({
            type: "done",
            ok: false,
            logs: [err instanceof Error ? err.stack || err.message : String(err)]
          });
        }
      }
    });

    this.panel.onDidDispose(() => {
      this.panel = undefined;
    });
  }

  private postMessage(message: unknown) {
    this.panel?.webview.postMessage(message);
  }

  private getHtml(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Input Inject</title>
<style>
  body { font-family: sans-serif; padding: 12px; }
  .row { margin-bottom: 10px; }
  input, textarea { width: 100%; box-sizing: border-box; }
  textarea { min-height: 120px; font-family: monospace; }
  #form.hidden { display: none; }
  #logs { white-space: pre-wrap; font-family: monospace; border: 1px solid #555; padding: 8px; min-height: 180px; }
</style>
</head>
<body>
  <div id="form">
    <div class="row">
      <label>CSS Selector</label>
      <input id="selector" placeholder="e.g. textarea, input[name='q']" />
    </div>
    <div class="row">
      <label>Inputs JSON</label>
      <textarea id="inputs">["h","e","l","l","o","Enter"]</textarea>
    </div>
    <div class="row">
      <button id="runBtn">Run</button>
    </div>
  </div>

  <div class="row">
    <strong>Status</strong>
    <div id="status">Idle</div>
  </div>

  <div class="row">
    <strong>Verbose logs</strong>
    <div id="logs"></div>
  </div>

<script>
const vscode = acquireVsCodeApi();

const form = document.getElementById("form");
const selectorEl = document.getElementById("selector");
const inputsEl = document.getElementById("inputs");
const runBtn = document.getElementById("runBtn");
const statusEl = document.getElementById("status");
const logsEl = document.getElementById("logs");

runBtn.addEventListener("click", () => {
  logsEl.textContent = "";
  statusEl.textContent = "Running...";
  form.classList.add("hidden");
  vscode.postMessage({
    type: "run",
    selector: selectorEl.value,
    inputs: inputsEl.value
  });
});

window.addEventListener("message", (event) => {
  const msg = event.data;
  if (msg.type === "running") {
    statusEl.textContent = "Running...";
    return;
  }

  if (msg.type === "done") {
    form.classList.remove("hidden");
    statusEl.textContent = msg.ok ? "Done" : "Failed";
    logsEl.textContent = Array.isArray(msg.logs) ? msg.logs.join("\\n") : "";
  }
});
</script>
</body>
</html>`;
  }
}