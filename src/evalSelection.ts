import * as vscode from "vscode";
import * as vm from "node:vm";
import * as util from "node:util";
import { inputInject } from "./inputInject";

function isCodeJsDocument(document: vscode.TextDocument): boolean {
  return document.fileName.endsWith(".code.js");
}

function stringifyResult(value: unknown, maxLen: number): string {
  let text: string;

  if (typeof value === "string") {
    text = value;
  } else {
    try {
      text = JSON.stringify(value, null, 2);
      if (text === undefined) {
        text = util.inspect(value, { depth: 6, breakLength: 100, maxArrayLength: 200 });
      }
    } catch {
      text = util.inspect(value, { depth: 6, breakLength: 100, maxArrayLength: 200 });
    }
  }

  if (!text || text.trim() === "") {
    text = String(value);
  }

  if (text.length > maxLen) {
    text = text.slice(0, maxLen) + "\n...[truncated]";
  }

  return text;
}

function toQuotedBlock(text: string): string {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  return lines.map(line => `> ${line}`).join("\n");
}

export async function evalSelectionAndAppend(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor.");
    return;
  }

  if (!isCodeJsDocument(editor.document)) {
    vscode.window.showWarningMessage("Eval Selection only runs in .code.js files.");
    return;
  }

  const selection = editor.selection;
  if (selection.isEmpty) {
    vscode.window.showWarningMessage("No selection.");
    return;
  }

  const code = editor.document.getText(selection).trim();
  if (!code) {
    vscode.window.showWarningMessage("Selection is empty.");
    return;
  }

  const config = vscode.workspace.getConfiguration("vsxdt");
  const maxLen = config.get<number>("maxResultLength", 20000);

  let rendered: string;
  try {
    const context = vm.createContext({
      console,
      require,
      process,
      Buffer,
      setTimeout,
      setInterval,
      clearTimeout,
      clearInterval,
      inputInject
    });

    const script = new vm.Script(code, {
      filename: editor.document.fileName
    });

    let result: unknown;
    try {
      result = await Promise.resolve(script.runInContext(context, { timeout: 5000 }));
    } catch (innerErr) {
      // PRD requires support for `await inputInject(...)` in selection eval.
      if (innerErr instanceof SyntaxError && code.includes("await")) {
        const awaitScript = new vm.Script(`(async () => (${code}))()`, {
          filename: editor.document.fileName
        });
        result = await Promise.resolve(awaitScript.runInContext(context, { timeout: 5000 }));
      } else {
        throw innerErr;
      }
    }
    rendered = stringifyResult(result, maxLen);
  } catch (err) {
    rendered = stringifyResult(err instanceof Error ? err.stack || err.message : err, maxLen);
  }

  const insertText = "\n" + toQuotedBlock(rendered) + "\n";

  await editor.edit(editBuilder => {
    editBuilder.insert(selection.end, insertText);
  });
}