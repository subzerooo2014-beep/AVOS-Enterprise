import { Injectable } from '@nestjs/common';
import { AiPriceAssessment, VehicleRecord } from './mobility.types';

@Injectable()
export class MobilityAiService {
  assessPrice(input: Partial<VehicleRecord> & { currency?: string }): AiPriceAssessment {
    const year = input.year ?? new Date().getFullYear();
    const mileageKm = input.mileageKm ?? 0;
    const base = Math.max(8000, 180000 - (new Date().getFullYear() - year) * 8500);
    const mileageAdjustment = Math.min(base * 0.45, mileageKm * 0.12);
    const conditionFactor =
      input.condition === 'new' ? 1.2 : input.condition === 'certified' ? 1.08 : 1;
    const estimatedPrice = Math.max(
      3000,
      Math.round((base - mileageAdjustment) * conditionFactor),
    );

    return {
      vehicleId: input.id,
      currency: (input.currency ?? input.price?.currency ?? 'AED').toUpperCase(),
      estimatedPrice,
      confidence: 0.62,
      factors: [
        'vehicle age',
        'mileage',
        'condition',
        'baseline regional depreciation model',
      ],
      requiresHumanApproval: true,
    };
  }

  recommend(vehicles: VehicleRecord[], preferences: {
    make?: string;
    maxPrice?: number;
    countryCode?: string;
  }) {
    return vehicles
      .map((vehicle) => {
        let score = 50;
        const reasons: string[] = [];
        if (preferences.make && vehicle.make.toLowerCase() === preferences.make.toLowerCase()) {
          score += 25;
          reasons.push('preferred make');
        }
        if (preferences.maxPrice !== undefined && vehicle.price.amount <= preferences.maxPrice) {
          score += 20;
          reasons.push('within budget');
        }
        if (
          preferences.countryCode &&
          vehicle.countryCode === preferences.countryCode.toUpperCase()
        ) {
          score += 5;
          reasons.push('same market');
        }
        return { vehicle, score: Math.min(score, 100), reasons };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }

  getStatus() {
    return {
      status: 'operational',
      mode: 'deterministic-bootstrap',
      upgradePath: [
        'market-data adapters',
        'model registry',
        'feature store',
        'online learning',
        'human-approved model promotion',
      ],
      humanFinalAuthority: true,
    };
  }
}