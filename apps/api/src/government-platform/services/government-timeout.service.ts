import { Injectable } from "@nestjs/common";
@Injectable()
export class GovernmentTimeoutService {
  execute<T>(operation: () => T, timeoutMs: number): T {
    const started = Date.now();
    const result = operation();
    if (Date.now() - started > timeoutMs) {
      throw new Error("Government provider timeout");
    }
    return result;
  }
}
