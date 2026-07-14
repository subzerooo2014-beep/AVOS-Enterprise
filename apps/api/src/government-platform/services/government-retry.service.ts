import { Injectable } from "@nestjs/common";
@Injectable()
export class GovernmentRetryService {
  delays(limit: number) {
    return Array.from(
      { length: limit },
      (_, index) => Math.min(30000, Math.pow(2, index) * 1000),
    );
  }
}
