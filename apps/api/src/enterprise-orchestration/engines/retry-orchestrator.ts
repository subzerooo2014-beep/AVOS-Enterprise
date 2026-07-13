import { Injectable } from "@nestjs/common";

@Injectable()
export class RetryOrchestrator {
  retry(input: any) {
    return {
      retryId: `retry-${Date.now()}`,
      status: "RETRYING",
      input,
    };
  }
}
