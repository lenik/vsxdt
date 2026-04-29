import * as vscode from "vscode";
import { evalSelectionAndAppend } from "./evalSelection";
import { InputInjectPanel } from "./panel";
import { toggleProxies } from "./toggleProxies";

export function activate(context: vscode.ExtensionContext) {
  const panel = new InputInjectPanel();

  context.subscriptions.push(
    vscode.commands.registerCommand("vsxdt.toggleProxies", async () => {
      await toggleProxies(context);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vsxdt.evalSelection", async () => {
      await evalSelectionAndAppend();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vsxdt.showInputInjectDialog", async () => {
      panel.show(context);
    })
  );
}

export function deactivate() {}