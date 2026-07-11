import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherBatchPolicyService {
  normalize(limit?: number) {
    const value = Number(limit ?? 20);

    return Math.min(Math.max(value, 1), 100);
  }
}
