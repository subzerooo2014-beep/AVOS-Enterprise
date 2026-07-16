import { Injectable } from "@nestjs/common";

@Injectable()
export class RetryPolicyService {
  async execute<T>(
    handler: () => Promise<T>,
    maxAttempts = 3,
    delayMs = 50,
  ): Promise<{ result: T; attempts: number }> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        const result = await handler();
        return { result, attempts: attempt };
      } catch (error) {
        lastError = error;

        if (attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
        }
      }
    }

    throw lastError;
  }
}
