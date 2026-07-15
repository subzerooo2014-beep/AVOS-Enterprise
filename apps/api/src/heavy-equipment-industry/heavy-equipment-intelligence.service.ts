import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { HeavyEquipmentAssetsService } from "./heavy-equipment-assets.service";
import { HeavyEquipmentOperationsService } from "./heavy-equipment-operations.service";
import {
  EquipmentAiAssessment,
  EquipmentTelematicsReading,
} from "./heavy-equipment-industry.types";
import { HEAVY_EQUIPMENT_CAPABILITIES } from "./heavy-equipment-industry.registry";

@Injectable()
export class HeavyEquipmentIntelligenceService {
  private readonly telematics = new Map<string, EquipmentTelematicsReading[]>();
  private readonly assessments = new Map<string, EquipmentAiAssessment>();

  constructor(
    private readonly assets: HeavyEquipmentAssetsService,
    private readonly operations: HeavyEquipmentOperationsService,
  ) {}

  capabilities() {
    return {
      system: "AVOS Heavy Equipment Industry Pack",
      industry: "HEAVY_EQUIPMENT",
      capabilities: [...HEAVY_EQUIPMENT_CAPABILITIES],
      capabilityCount: HEAVY_EQUIPMENT_CAPABILITIES.length,
      status: "READY",
    };
  }

  recordTelematics(
    input: Omit<EquipmentTelematicsReading, "id">,
  ): EquipmentTelematicsReading {
    this.assets.requireEquipment(input.equipmentId);

    if (input.fuelLevelPercent < 0 || input.fuelLevelPercent > 100) {
      throw new Error("Fuel level must be between 0 and 100");
    }

    const reading: EquipmentTelematicsReading = {
      ...input,
      id: randomUUID(),
      faultCodes: [...input.faultCodes],
    };

    const readings = this.telematics.get(input.equipmentId) ?? [];
    readings.push(reading);

    if (readings.length > 500) {
      readings.splice(0, readings.length - 500);
    }

    this.telematics.set(input.equipmentId, readings);
    return this.cloneTelematics(reading);
  }

  assessEquipment(
    input: Omit<EquipmentAiAssessment, "id" | "createdAt">,
  ): EquipmentAiAssessment {
    this.assets.requireEquipment(input.equipmentId);

    if (input.score < 0 || input.score > 100) {
      throw new Error("AI assessment score must be between 0 and 100");
    }

    const assessment: EquipmentAiAssessment = {
      ...input,
      id: randomUUID(),
      factors: [...input.factors],
      createdAt: new Date().toISOString(),
    };

    this.assessments.set(assessment.id, assessment);
    return this.cloneAssessment(assessment);
  }

  latestTelematics(equipmentId: string) {
    this.assets.requireEquipment(equipmentId);
    const readings = this.telematics.get(equipmentId) ?? [];
    const latest =
      readings.length > 0
        ? readings[readings.length - 1]
        : undefined;

    return latest ? this.cloneTelematics(latest) : null;
  }

  predictiveMaintenance(equipmentId: string) {
    const equipment = this.assets.getEquipment(equipmentId);
    const latest = this.latestTelematics(equipmentId);

    const riskFactors: string[] = [];
    let riskScore = 0;

    if (equipment.operatingHours >= 10000) {
      riskScore += 25;
      riskFactors.push("high-operating-hours");
    } else if (equipment.operatingHours >= 5000) {
      riskScore += 12;
      riskFactors.push("elevated-operating-hours");
    }

    if (latest) {
      if (latest.engineTemperatureCelsius >= 105) {
        riskScore += 25;
        riskFactors.push("high-engine-temperature");
      }

      if (latest.batteryVoltage < 11.8) {
        riskScore += 15;
        riskFactors.push("low-battery-voltage");
      }

      if (latest.faultCodes.length > 0) {
        riskScore += Math.min(25, latest.faultCodes.length * 8);
        riskFactors.push("active-fault-codes");
      }

      if (latest.idleMinutes >= 180) {
        riskScore += 10;
        riskFactors.push("excessive-idle-time");
      }
    } else {
      riskScore += 10;
      riskFactors.push("missing-telematics-data");
    }

    const boundedScore = Math.min(100, riskScore);

    return {
      equipmentId,
      riskScore: boundedScore,
      level:
        boundedScore >= 70
          ? "CRITICAL"
          : boundedScore >= 40
            ? "HIGH"
            : boundedScore >= 20
              ? "MEDIUM"
              : "LOW",
      recommendedAction:
        boundedScore >= 70
          ? "Stop equipment and open critical maintenance work order"
          : boundedScore >= 40
            ? "Schedule inspection within 24 hours"
            : boundedScore >= 20
              ? "Schedule preventive maintenance"
              : "Continue normal monitoring",
      factors: riskFactors,
      generatedAt: new Date().toISOString(),
    };
  }

  dashboard(tenantId?: string) {
    const equipment = this.assets.listEquipment({ tenantId });
    const operational = this.operations.getOperationalSnapshot();

    const available = equipment.filter(
      (item) => item.lifecycleStatus === "AVAILABLE",
    ).length;

    const deployed = equipment.filter(
      (item) => item.lifecycleStatus === "DEPLOYED",
    ).length;

    const rented = equipment.filter(
      (item) => item.lifecycleStatus === "RENTED",
    ).length;

    const maintenance = equipment.filter(
      (item) =>
        item.lifecycleStatus === "IN_MAINTENANCE" ||
        item.lifecycleStatus === "OUT_OF_SERVICE",
    ).length;

    const fleetMarketValue = equipment.reduce(
      (sum, item) => sum + item.marketValue,
      0,
    );

    const fleetBookValue = equipment.reduce(
      (sum, item) => sum + item.bookValue,
      0,
    );

    const utilized = deployed + rented;
    const utilizationRate =
      equipment.length === 0
        ? 0
        : Number(((utilized / equipment.length) * 100).toFixed(2));

    return {
      system: "AVOS Heavy Equipment Industry Pack",
      equipment: equipment.length,
      available,
      deployed,
      rented,
      maintenance,
      utilizationRate,
      fleetMarketValue: Number(fleetMarketValue.toFixed(2)),
      fleetBookValue: Number(fleetBookValue.toFixed(2)),
      unrealizedValueDifference: Number(
        (fleetMarketValue - fleetBookValue).toFixed(2),
      ),
      telematicsAssets: this.telematics.size,
      aiAssessments: this.assessments.size,
      lowStockParts: this.assets.listLowStockParts(tenantId).length,
      ...operational,
      generatedAt: new Date().toISOString(),
    };
  }

  private cloneTelematics(
    value: EquipmentTelematicsReading,
  ): EquipmentTelematicsReading {
    return {
      ...value,
      faultCodes: [...value.faultCodes],
    };
  }

  private cloneAssessment(
    value: EquipmentAiAssessment,
  ): EquipmentAiAssessment {
    return {
      ...value,
      factors: [...value.factors],
    };
  }
}