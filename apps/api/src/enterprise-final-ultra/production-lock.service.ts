import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductionLockService {
  lock() {
    return {
      version: "1.0.0",
      locked: true,
      immutableBaselineCreated: true,
      releaseReady: true,
      lockedAt: new Date().toISOString(),
    };
  }
}