import { Injectable } from "@nestjs/common";

@Injectable()
export class SandboxSimulatorService {
  simulate(input: { latencyMs?: number; fail?: boolean; payload: Record<string, unknown> }) {
    if (input.fail) throw new Error("Sandbox simulated failure");
    return { success: true, latencyMs: input.latencyMs ?? 50, payload: input.payload };
  }
}
