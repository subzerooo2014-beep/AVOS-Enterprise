import { Injectable } from "@nestjs/common";

@Injectable()
export class RetryPolicyService {
  async run<T>(handler: () => Promise<T>, attempts = 3): Promise<T> {
    let lastError: any;

    for (let i = 1; i <= attempts; i++) {
      try {
        return await handler();
      } catch (error) {
        lastError = error;
        await new Promise((resolve) => setTimeout(resolve, i * 150));
      }
    }

    throw lastError;
  }
}
