import { Injectable } from "@nestjs/common";
import { ValuateVehicleDto } from "./dto/valuate-vehicle.dto";

@Injectable()
export class VehicleValuationService {
  valuate(dto: ValuateVehicleDto) {
    const currentYear = new Date().getFullYear();
    const age = Math.max(0, currentYear - dto.year);

    const base = dto.marketPrice ?? 100000;
    const mileagePenalty = dto.mileage ? Math.min(dto.mileage / 100000, 0.45) : 0.1;
    const agePenalty = Math.min(age * 0.055, 0.55);

    const conditionFactor =
      dto.condition?.toLowerCase() === "excellent" ? 1.08 :
      dto.condition?.toLowerCase() === "good" ? 1.0 :
      dto.condition?.toLowerCase() === "fair" ? 0.88 :
      dto.condition?.toLowerCase() === "poor" ? 0.72 : 0.95;

    const demandFactor = dto.demandScore ? 1 + ((dto.demandScore - 50) / 500) : 1;

    const estimated = Math.max(
      0,
      base * (1 - agePenalty) * (1 - mileagePenalty) * conditionFactor * demandFactor
    );

    return {
      make: dto.make,
      model: dto.model,
      year: dto.year,
      estimatedValue: Math.round(estimated),
      confidence: dto.marketPrice ? "MEDIUM" : "LOW",
      factors: {
        age,
        agePenalty,
        mileagePenalty,
        conditionFactor,
        demandFactor,
      },
    };
  }
}
