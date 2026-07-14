import { Injectable } from "@nestjs/common";

@Injectable()
export class RetryPolicyService {
  delays(limit: number) {
    return Array.from({ length: limit }, (_, i) => Math.min(30000, Math.pow(2, i) * 1000));
  }
}
