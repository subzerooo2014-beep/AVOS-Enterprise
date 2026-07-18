import { BadRequestException, Injectable } from "@nestjs/common";
import { FactoryResourceSnapshot } from "./factory-intelligence.contracts";

@Injectable()
export class FactoryResourceAllocationService {
  private readonly totalUnits = 100;
  private allocatedUnits = 0;
  private activeWorkers = 0;

  allocate(requiredUnits: number): number {
    const safeUnits = Math.max(1, Math.min(requiredUnits, this.totalUnits));

    if (safeUnits > this.availableUnits()) {
      throw new BadRequestException(
        `Insufficient factory resources. Required ${safeUnits}, available ${this.availableUnits()}.`,
      );
    }

    this.allocatedUnits += safeUnits;
    this.activeWorkers += 1;
    return safeUnits;
  }

  release(units: number): void {
    this.allocatedUnits = Math.max(0, this.allocatedUnits - units);
    this.activeWorkers = Math.max(0, this.activeWorkers - 1);
  }

  availableUnits(): number {
    return this.totalUnits - this.allocatedUnits;
  }

  snapshot(queueDepth: number): FactoryResourceSnapshot {
    return {
      totalUnits: this.totalUnits,
      availableUnits: this.availableUnits(),
      allocatedUnits: this.allocatedUnits,
      activeWorkers: this.activeWorkers,
      queueDepth,
    };
  }
}
