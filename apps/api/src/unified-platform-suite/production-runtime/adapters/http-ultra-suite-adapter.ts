import { UltraSuiteAdapterContract, UltraSuiteHealthResult } from "../contracts/production-runtime.types";

export interface HttpUltraSuiteAdapterOptions {
  suiteId: string;
  suiteName: string;
  baseUrl?: string;
  healthPath: string;
  capabilitiesPath?: string;
  executePath?: string;
  timeoutMs?: number;
}

export class HttpUltraSuiteAdapter implements UltraSuiteAdapterContract {
  readonly suiteId: string;
  readonly suiteName: string;
  readonly version = "2.1.0";

  private lastSuccessfulHealthCheck: string | null = null;

  constructor(private readonly options: HttpUltraSuiteAdapterOptions) {
    this.suiteId = options.suiteId;
    this.suiteName = options.suiteName;
  }

  async health(): Promise<UltraSuiteHealthResult> {
    const checkedAt = new Date().toISOString();

    if (!this.options.baseUrl) {
      return {
        suiteId: this.suiteId,
        suiteName: this.suiteName,
        connected: false,
        connectionState: "Disconnected",
        statusCode: null,
        latencyMs: 0,
        lastSuccessfulHealthCheck: this.lastSuccessfulHealthCheck,
        checkedAt,
        endpoint: null,
        status: "base-url-not-configured",
        error: "Base URL is not configured"
      };
    }

    const endpoint = new URL(this.options.healthPath, this.options.baseUrl).toString();
    const startedAt = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      this.options.timeoutMs ?? 5000
    );

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          accept: "application/json"
        },
        signal: controller.signal
      });

      const latencyMs = Date.now() - startedAt;
      const raw = await response.text();

      let responseBody: Record<string, unknown> = {};
      if (raw) {
        try {
          responseBody = JSON.parse(raw) as Record<string, unknown>;
        } catch {
          responseBody = { raw };
        }
      }

      const connected = response.status >= 200 && response.status < 300;

      if (connected) {
        this.lastSuccessfulHealthCheck = checkedAt;
      }

      return {
        suiteId: this.suiteId,
        suiteName: this.suiteName,
        connected,
        connectionState: connected ? "Connected" : "Disconnected",
        statusCode: response.status,
        latencyMs,
        lastSuccessfulHealthCheck: this.lastSuccessfulHealthCheck,
        checkedAt,
        endpoint,
        status: connected ? "healthy" : this.mapStatus(response.status),
        response: responseBody
      };
    } catch (error) {
      return {
        suiteId: this.suiteId,
        suiteName: this.suiteName,
        connected: false,
        connectionState: "Disconnected",
        statusCode: null,
        latencyMs: Date.now() - startedAt,
        lastSuccessfulHealthCheck: this.lastSuccessfulHealthCheck,
        checkedAt,
        endpoint,
        status: "unreachable",
        error: error instanceof Error ? error.message : String(error)
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  async discoverCapabilities() {
    if (!this.options.baseUrl || !this.options.capabilitiesPath) {
      return [];
    }

    const result = await this.request(
      this.options.capabilitiesPath,
      "GET"
    );

    const capabilities = result.capabilities;

    return Array.isArray(capabilities)
      ? capabilities.map(String)
      : [];
  }

  async execute(action: string, payload: Record<string, unknown>) {
    if (!this.options.baseUrl || !this.options.executePath) {
      return {
        suiteId: this.suiteId,
        suiteName: this.suiteName,
        action,
        accepted: false,
        status: "adapter-not-connected",
        payload
      };
    }

    return this.request(
      this.options.executePath,
      "POST",
      { action, payload }
    );
  }

  private async request(
    path: string,
    method: "GET" | "POST",
    body?: unknown
  ): Promise<Record<string, unknown>> {
    if (!this.options.baseUrl) {
      return {
        connected: false,
        status: "base-url-not-configured"
      };
    }

    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      this.options.timeoutMs ?? 5000
    );

    try {
      const response = await fetch(
        new URL(path, this.options.baseUrl),
        {
          method,
          headers: {
            "content-type": "application/json",
            accept: "application/json"
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal
        }
      );

      const text = await response.text();

      let data: Record<string, unknown> = {};
      if (text) {
        try {
          data = JSON.parse(text) as Record<string, unknown>;
        } catch {
          data = { raw: text };
        }
      }

      return {
        suiteId: this.suiteId,
        suiteName: this.suiteName,
        connected: response.ok,
        statusCode: response.status,
        ...data
      };
    } catch (error) {
      return {
        suiteId: this.suiteId,
        suiteName: this.suiteName,
        connected: false,
        status: "unreachable",
        error: error instanceof Error ? error.message : String(error)
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  private mapStatus(statusCode: number) {
    if (statusCode === 404) {
      return "health-endpoint-not-found";
    }

    if (statusCode >= 500) {
      return "suite-server-error";
    }

    if (statusCode >= 400) {
      return "suite-client-error";
    }

    if (statusCode >= 300) {
      return "unexpected-redirect";
    }

    return "unhealthy";
  }
}