import { Injectable } from "@nestjs/common";

@Injectable()
export class CircuitBreakerService {
  private readonly state = new Map<string, { failures: number; openedAt?: number }>();

  canExecute(code: string) {
    const current = this.state.get(code);
    if (!current?.openedAt) return true;
    if (Date.now() - current.openedAt > 30000) {
      this.state.set(code, { failures: 0 });
      return true;
    }
    return false;
  }

  success(code: string) { this.state.set(code, { failures: 0 }); }

  failure(code: string) {
    const current = this.state.get(code) ?? { failures: 0 };
    current.failures += 1;
    if (current.failures >= 3) current.openedAt = Date.now();
    this.state.set(code, current);
  }
}
