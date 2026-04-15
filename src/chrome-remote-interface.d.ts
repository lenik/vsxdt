declare module "chrome-remote-interface" {
  export interface TargetInfo {
    id: string;
    title?: string;
    url?: string;
    type?: string;
  }

  export interface ConnectionOptions {
    host: string;
    port: number;
    target?: TargetInfo;
  }

  export interface CDPClient {
    Runtime: {
      enable(): Promise<void>;
      evaluate(options: {
        expression: string;
        returnByValue?: boolean;
        awaitPromise?: boolean;
      }): Promise<{
        result: { value: unknown };
        exceptionDetails?: unknown;
      }>;
    };
    Page: {
      enable(): Promise<void>;
    };
    close(): Promise<void>;
  }

  interface CDPStatic {
    (options: ConnectionOptions): Promise<CDPClient>;
    List(options: { host: string; port: number }): Promise<TargetInfo[]>;
  }

  const CDP: CDPStatic;
  export default CDP;
}
