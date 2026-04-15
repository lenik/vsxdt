import CDP from "chrome-remote-interface";
import * as vscode from "vscode";

export interface ChromeTargetInfo {
  id: string;
  title: string;
  url: string;
  type: string;
}

export async function listPageTargets(): Promise<ChromeTargetInfo[]> {
  const config = vscode.workspace.getConfiguration("devtools");
  const host = config.get<string>("chromeHost", "127.0.0.1");
  const port = config.get<number>("chromePort", 9222);

  const targets = await CDP.List({ host, port });
  return targets
    .filter(t => t.type === "page")
    .map(t => ({
      id: t.id,
      title: t.title ?? "",
      url: t.url ?? "",
      type: t.type ?? ""
    }));
}

export async function connectToPreferredTarget() {
  const config = vscode.workspace.getConfiguration("devtools");
  const host = config.get<string>("chromeHost", "127.0.0.1");
  const port = config.get<number>("chromePort", 9222);
  const urlIncludes = config.get<string>("targetUrlIncludes", "").trim();

  const targets = await CDP.List({ host, port });
  const pages = targets.filter(t => t.type === "page");

  const chosen =
    (urlIncludes
      ? pages.find(t => (t.url ?? "").includes(urlIncludes))
      : undefined) ?? pages[0];

  if (!chosen) {
    throw new Error("No Chrome page target found.");
  }

  const client = await CDP({
    host,
    port,
    target: chosen
  });

  return {
    client,
    target: {
      id: chosen.id,
      title: chosen.title ?? "",
      url: chosen.url ?? "",
      type: chosen.type ?? ""
    }
  };
}