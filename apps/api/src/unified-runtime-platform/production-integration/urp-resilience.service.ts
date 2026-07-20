import { Injectable } from "@nestjs/common";
import { UrpCircuitState } from "./urp-production.contracts";

@Injectable()
export class UrpResilienceService {
  private readonly circuits = new Map<string, UrpCircuitState>();
  private readonly failureThreshold = Number(
    process.env.AVOS_URP_CIRCUIT_FAILURE_THRESHOLD ?? 3,
  );
  private readonly resetMs = Number(
    process.env.AVOS_URP_CIRCUIT_RESET_MS ?? 30000,
  );

  state(key: string): UrpCircuitState {
    return (
      this.circuits.get(key) ?? {
        key,
        state: "closed",
        failures: 0,
        successes: 0,
        updatedAt: new Date().toISOString(),
      }
    );
  }

  list() {
    return [...this.circuits.values()];
  }

  async execute<T>(
    key: string,
    operation: () => Promise<T>,
    options?: { timeoutMs?: number; retries?: number },
  ): Promise<T> {
    const current = this.state(key);

    if (current.state === "open") {
      const nextProbe = current.nextProbeAt
        ? new Date(current.nextProbeAt).getTime()
        : 0;

      if (Date.now() < nextProbe) {
        throw new Error("URP circuit is open: " + key);
      }

      this.circuits.set(key, {
        ...current,
        state: "half-open",
        updatedAt: new Date().toISOString(),
      });
    }

    const retries = Math.max(options?.retries ?? 2, 0);
    let lastError: unknown;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        const result = await this.withTimeout(
          operation(),
          options?.timeoutMs ?? 5000,
        );
        this.onSuccess(key);
        return result;
      } catch (error) {
        lastError = error;
        if (attempt < retries) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.min(250 * 2 ** attempt, 2000)),
          );
        }
      }
    }

    this.onFailure(key);
    throw lastError instanceof Error
      ? lastError
      : new Error(String(lastError));
  }

  private withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(
          () => reject(new Error("URP operation timed out after " + timeoutMs + "ms")),
          timeoutMs,
        ),
      ),
    ]);
  }

  private onSuccess(key: string) {
    const current = this.state(key);
    this.circuits.set(key, {
      ...current,
      state: "closed",
      failures: 0,
      successes: current.successes + 1,
      openedAt: undefined,
      nextProbeAt: undefined,
      updatedAt: new Date().toISOString(),
    });
  }

  private onFailure(key: string) {
    const current = this.state(key);
    const failures = current.failures + 1;
    const open = failures >= this.failureThreshold;

    this.circuits.set(key, {
      ...current,
      state: open ? "open" : current.state,
      failures,
      openedAt: open ? new Date().toISOString() : current.openedAt,
      nextProbeAt: open
        ? new Date(Date.now() + this.resetMs).toISOString()
        : current.nextProbeAt,
      updatedAt: new Date().toISOString(),
    });
  }
}