import { Injectable } from "@nestjs/common";

@Injectable()
export class CrossServiceCoordinationService {
  coordinate(units: string[], objective: string) {
    const uniqueUnits = Array.from(new Set(units.filter(Boolean)));
    return {
      coordinationId: `aeos-coordination:${Date.now()}`,
      objective,
      units: uniqueUnits,
      executionOrder: uniqueUnits.map((unit, index) => ({
        unit,
        order: index + 1,
      })),
      status: "planned",
      humanFinalAuthority: true,
      createdAt: new Date().toISOString(),
    };
  }
}