import { Vehicle } from "@/data/vehicles";

export interface VehicleIntelligenceScore {
  overall: number;
  value: number;
  reliability: number;
  resale: number;
  ownership: number;
  confidence: number;
  verdict:
    | "excellent"
    | "good"
    | "fair"
    | "expensive";
  summary: string;
}

export interface OwnershipEstimate {
  yearlyFuel: number;
  yearlyInsurance: number;
  yearlyMaintenance: number;
  yearlyRegistration: number;
  fiveYearTotal: number;
}

export interface VehicleRecommendation {
  vehicle: Vehicle;
  score: number;
  reasons: readonly string[];
}

const brandReliability: Readonly<Record<string, number>> = {
  Toyota: 94,
  Lexus: 92,
  Tesla: 82,
  "Mercedes-Benz": 80,
  BMW: 78,
  Porsche: 84,
  Ford: 81,
  "Land Rover": 76,
};

const resaleStrength: Readonly<Record<string, number>> = {
  Toyota: 96,
  Lexus: 93,
  "Mercedes-Benz": 87,
  Porsche: 86,
  "Land Rover": 84,
  Ford: 82,
  BMW: 80,
  Tesla: 78,
};

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function analyzeVehicle(
  vehicle: Vehicle,
): VehicleIntelligenceScore {
  const age = Math.max(0, 2026 - vehicle.year);
  const mileagePenalty = Math.min(28, vehicle.mileage / 5000);
  const agePenalty = age * 3.5;

  const reliability =
    brandReliability[vehicle.brand] ?? 78;

  const resale =
    resaleStrength[vehicle.brand] ?? 77;

  const value = clamp(
    92 -
      vehicle.price / 45000 -
      mileagePenalty / 2 +
      (vehicle.verified ? 6 : 0) +
      (vehicle.condition === "new" ? 4 : 0),
  );

  const ownership = clamp(
    95 -
      vehicle.price / 70000 -
      agePenalty -
      (vehicle.fuel === "electric" ? -7 : 0),
  );

  const overall = clamp(
    value * 0.3 +
      reliability * 0.25 +
      resale * 0.25 +
      ownership * 0.2,
  );

  const verdict =
    overall >= 88
      ? "excellent"
      : overall >= 80
        ? "good"
        : overall >= 70
          ? "fair"
          : "expensive";

  const summary =
    verdict === "excellent"
      ? "فرصة قوية تجمع بين السعر، الاعتمادية، وإعادة البيع."
      : verdict === "good"
        ? "خيار جيد مع توازن واضح بين السعر والمواصفات."
        : verdict === "fair"
          ? "خيار مقبول، لكن ينصح بالمقارنة وطلب فحص شامل."
          : "السعر أو تكلفة الملكية أعلى من البدائل المشابهة.";

  return {
    overall,
    value,
    reliability,
    resale,
    ownership,
    confidence: vehicle.verified ? 96 : 82,
    verdict,
    summary,
  };
}

export function estimateOwnership(
  vehicle: Vehicle,
): OwnershipEstimate {
  const annualKm = 20000;

  const yearlyFuel =
    vehicle.fuel === "electric"
      ? 2400
      : vehicle.fuel === "hybrid"
        ? 5200
        : vehicle.body === "suv" ||
            vehicle.body === "pickup"
          ? 10500
          : 7600;

  const yearlyInsurance = Math.round(
    Math.max(3200, vehicle.price * 0.018),
  );

  const yearlyMaintenance = Math.round(
    2800 +
      vehicle.price * 0.012 +
      Math.max(0, 2026 - vehicle.year) * 700 +
      annualKm / 20,
  );

  const yearlyRegistration = 950;

  return {
    yearlyFuel,
    yearlyInsurance,
    yearlyMaintenance,
    yearlyRegistration,
    fiveYearTotal:
      (yearlyFuel +
        yearlyInsurance +
        yearlyMaintenance +
        yearlyRegistration) *
      5,
  };
}

export function recommendVehicles(
  vehicles: readonly Vehicle[],
  input: {
    budget?: number;
    preferredBody?: Vehicle["body"];
    preferredCity?: string;
    requireVerified?: boolean;
  },
): readonly VehicleRecommendation[] {
  return vehicles
    .map((vehicle) => {
      const reasons: string[] = [];
      const intelligence = analyzeVehicle(vehicle);
      let score = intelligence.overall;

      if (
        input.budget !== undefined &&
        vehicle.price <= input.budget
      ) {
        score += 8;
        reasons.push("ضمن الميزانية");
      }

      if (
        input.preferredBody !== undefined &&
        vehicle.body === input.preferredBody
      ) {
        score += 10;
        reasons.push("نوع الهيكل مناسب");
      }

      if (
        input.preferredCity !== undefined &&
        vehicle.city === input.preferredCity
      ) {
        score += 5;
        reasons.push("متوفر في مدينتك");
      }

      if (
        input.requireVerified &&
        vehicle.verified
      ) {
        score += 7;
        reasons.push("إعلان موثق");
      }

      if (vehicle.featured) {
        score += 3;
        reasons.push("فرصة مميزة");
      }

      return {
        vehicle,
        score: clamp(score),
        reasons:
          reasons.length > 0
            ? reasons
            : ["تقييم AVOS مرتفع"],
      };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 4);
}
