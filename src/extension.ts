import * as vscode from "vscode";
import { evalSelectionAndAppend } from "./evalSelection";
import { InputInjectPanel } from "./panel";

export function activate(context: vscode.ExtensionContext) {
  const panel = new InputInjectPanel();

  context.subscriptions.push(
    vscode.commands.registerCommand("devtools.evalSelection", async () => {
      await evalSelectionAndAppend();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("devtools.showInputInjectDialog", async () => {
      panel.show(context);
    })
  );
}

export function deactivate() {}