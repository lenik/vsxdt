interface InputInjectResult {
  ok: boolean;
  logs: string[];
}

declare function inputInject(selector: string, inputs: string[]): Promise<InputInjectResult>;
