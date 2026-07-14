import { Injectable } from "@nestjs/common";

@Injectable()
export class TimeoutPolicyService {
  execute<T>(operation: () => T, timeoutMs: number): T {
    const started = Date.now();
    const result = operation();
    if (Date.now() - started > timeoutMs) throw new Error("Provider timeout");
    return result;
  }
}
