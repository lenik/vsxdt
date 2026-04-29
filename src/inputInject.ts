import { connectToPreferredTarget } from "./cdp";

export interface InputInjectResult {
  ok: boolean;
  logs: string[];
}

function buildInjectScript(selector: string, inputs: string[]): string {
  return `
(() => {
  const logs = [];
  const selector = ${JSON.stringify(selector)};
  const inputs = ${JSON.stringify(inputs)};

  function log(msg) { logs.push(String(msg)); }
  log(\`selector: \${selector}\`);

  const elements = Array.from(document.querySelectorAll(selector));
  log(\`matched elements: \${elements.length}\`);
  if (!elements.length) {
    return { ok: false, logs: [\`No elements matched selector: \${selector}\`] };
  }

  function isEditable(el) {
    if (!el) return false;
    if (el instanceof HTMLInputElement) return true;
    if (el instanceof HTMLTextAreaElement) return true;
    if (el.isContentEditable) return true;
    return false;
  }

  function appendText(el, text) {
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      const start = el.selectionStart ?? el.value.length;
      const end = el.selectionEnd ?? el.value.length;
      const next = el.value.slice(0, start) + text + el.value.slice(end);
      el.value = next;
      const pos = start + text.length;
      el.selectionStart = pos;
      el.selectionEnd = pos;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }

    if (el.isContentEditable) {
      document.execCommand("insertText", false, text);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }

    throw new Error("Element is not editable.");
  }

  function dispatchKeyboard(el, key, type) {
    const ev = new KeyboardEvent(type, {
      key,
      bubbles: true,
      cancelable: true
    });
    el.dispatchEvent(ev);
  }

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    if (!isEditable(el)) {
      log(\`[\${i}] skipped: not editable\`);
      continue;
    }

    el.focus();
    log(\`[\${i}] focused: \${el.tagName.toLowerCase()}\`);

    for (const key of inputs) {
      dispatchKeyboard(el, key, "keydown");

      if (key === "Enter") {
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el.isContentEditable) {
          appendText(el, "\\n");
          log(\`[\${i}] key Enter\`);
        }
      } else if (key === "Tab") {
        appendText(el, "\\t");
        log(\`[\${i}] key Tab\`);
      } else if (key === "Esc" || key === "Escape") {
        log(\`[\${i}] key Escape\`);
      } else if (key === "Backspace") {
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
          const pos = el.selectionStart ?? el.value.length;
          if (pos > 0) {
            el.value = el.value.slice(0, pos - 1) + el.value.slice(el.selectionEnd ?? pos);
            el.selectionStart = pos - 1;
            el.selectionEnd = pos - 1;
            el.dispatchEvent(new Event("input", { bubbles: true }));
          }
        }
        log(\`[\${i}] key Backspace\`);
      } else {
        dispatchKeyboard(el, key, "keypress");
        appendText(el, key);
        log(\`[\${i}] key \${JSON.stringify(key)}\`);
      }

      dispatchKeyboard(el, key, "keyup");
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  return { ok: true, logs };
})()
`;
}

export async function inputInject(selector: string, inputs: string[]): Promise<InputInjectResult> {
  if (!selector.trim()) {
    return {
      ok: false,
      logs: ["selector is required."]
    };
  }

  const { client, target } = await connectToPreferredTarget();
  const logs: string[] = [];

  try {
    const { Runtime, Page } = client;
    await Promise.all([Runtime.enable(), Page.enable()]);

    logs.push(`Connected target: ${target.title || "(untitled)"} ${target.url}`);

    const expression = buildInjectScript(selector, inputs);
    const evalResult = await Runtime.evaluate({
      expression,
      returnByValue: true,
      awaitPromise: true
    });

    if (evalResult.exceptionDetails) {
      return {
        ok: false,
        logs: logs.concat("Runtime exception during injection.")
      };
    }

    const value = evalResult.result.value as InputInjectResult;
    return {
      ok: !!value?.ok,
      logs: logs.concat(value?.logs ?? [])
    };
  } finally {
    await client.close();
  }
}