import { Injectable } from "@nestjs/common";

@Injectable()
export class AiRetryPolicyService {
  async run<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
    let lastError: any;

    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError;
  }
}
