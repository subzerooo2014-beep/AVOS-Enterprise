import { UltraKFinding, UltraKSeverity } from "./contracts";

export interface EconomicInitiative {
  key: string;
  investment: number;
  expectedRevenue: number;
  operatingCost: number;
  riskPercent: number;
  strategicValue: number;
}

export interface EconomicInitiativeResult {
  key: string;
  netValue: number;
  roiPercent: number;
  riskAdjustedValue: number;
  economicScore: number;
  viable: boolean;
}

export interface AutonomousEnterpriseEconomyResult {
  initiatives: EconomicInitiativeResult[];
  portfolioValue: number;
  portfolioScore: number;
  findings: UltraKFinding[];
  evaluatedAt: string;
}

export class AutonomousEnterpriseEconomy {
  evaluate(
    initiatives: readonly EconomicInitiative[],
  ): AutonomousEnterpriseEconomyResult {
    const findings: UltraKFinding[] = [];

    const results = initiatives.map((initiative): EconomicInitiativeResult => {
      const netValue =
        initiative.expectedRevenue -
        initiative.investment -
        initiative.operatingCost;

      const roiPercent =
        initiative.investment <= 0
          ? 0
          : Math.round((netValue / initiative.investment) * 100);

      const riskAdjustedValue =
        Math.round(netValue * (1 - initiative.riskPercent / 100) * 100) / 100;

      const economicScore = Math.max(
        0,
        Math.min(
          100,
          Math.round(
            Math.min(100, Math.max(0, roiPercent)) * 0.55 +
              initiative.strategicValue * 0.45,
          ),
        ),
      );

      const viable = riskAdjustedValue > 0 && economicScore >= 60;

      if (!viable) {
        findings.push({
          code: "ECONOMIC_INITIATIVE_NOT_VIABLE",
          severity:
            initiative.riskPercent >= 70
              ? UltraKSeverity.ERROR
              : UltraKSeverity.WARNING,
          message: `Initiative ${initiative.key} is not economically viable.`,
          subject: initiative.key,
          metadata: {
            netValue,
            roiPercent,
            riskAdjustedValue,
            economicScore,
          },
        });
      }

      return {
        key: initiative.key,
        netValue,
        roiPercent,
        riskAdjustedValue,
        economicScore,
        viable,
      };
    });

    const portfolioValue = Math.round(
      results.reduce((sum, result) => sum + result.riskAdjustedValue, 0) * 100,
    ) / 100;

    const portfolioScore =
      results.length === 0
        ? 100
        : Math.round(
            results.reduce((sum, result) => sum + result.economicScore, 0) /
              results.length,
          );

    return {
      initiatives: results,
      portfolioValue,
      portfolioScore,
      findings,
      evaluatedAt: new Date().toISOString(),
    };
  }
}
