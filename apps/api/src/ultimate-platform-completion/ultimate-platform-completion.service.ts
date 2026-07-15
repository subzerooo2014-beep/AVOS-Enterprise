import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { ULTIMATE_PLATFORM_CAPABILITIES } from "./ultimate-platform-completion.registry";
import {
  UltimatePlatformCapability,
  UltimatePortfolioItem,
  UltimateScenario,
  UltimateScorecard,
} from "./ultimate-platform-completion.types";

@Injectable()
export class UltimatePlatformCompletionService {
  private readonly portfolio = new Map<string, UltimatePortfolioItem>();
  private readonly scenarios = new Map<string, UltimateScenario>();
  private readonly scorecards = new Map<string, UltimateScorecard>();
  private readonly codeIndex = new Set<string>();

  framework() {
    return {
      system: "AVOS Ultimate Platform Completion Bundle V1",
      status: "READY",
      capabilityCount: Object.keys(ULTIMATE_PLATFORM_CAPABILITIES).length,
      capabilities: structuredClone(ULTIMATE_PLATFORM_CAPABILITIES),
    };
  }

  createPortfolioItem(
    capability: UltimatePlatformCapability,
    input: Omit<
      UltimatePortfolioItem,
      "id" | "capability" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    if (!ULTIMATE_PLATFORM_CAPABILITIES[capability]) {
      throw new Error(`Unknown capability: ${capability}`);
    }

    if (!input.name.trim() || !input.owner.trim()) {
      throw new Error("Name and owner are required");
    }

    if (
      input.investmentAmount < 0 ||
      input.strategicScore < 0 ||
      input.strategicScore > 100 ||
      input.maturityScore < 0 ||
      input.maturityScore > 100 ||
      input.riskScore < 0 ||
      input.riskScore > 100
    ) {
      throw new Error("Investment and scores are invalid");
    }

    const key = `${capability}:${input.code.trim().toUpperCase()}`;

    if (this.codeIndex.has(key)) {
      throw new Error(`Duplicate portfolio code: ${key}`);
    }

    const now = new Date().toISOString();

    const item: UltimatePortfolioItem = {
      ...input,
      id: randomUUID(),
      capability,
      code: input.code.trim().toUpperCase(),
      name: input.name.trim(),
      owner: input.owner.trim(),
      status: "DRAFT",
      createdAt: now,
      updatedAt: now,
    };

    this.portfolio.set(item.id, item);
    this.codeIndex.add(key);

    return { ...item };
  }

  activatePortfolioItem(id: string) {
    const item = this.requirePortfolioItem(id);

    if (item.strategicScore < 60) {
      throw new Error("Strategic score is too low for activation");
    }

    item.status = "ACTIVE";
    item.updatedAt = new Date().toISOString();
    this.portfolio.set(id, item);

    return { ...item };
  }

  createScenario(
    portfolioItemId: string,
    input: Omit<UltimateScenario, "id" | "portfolioItemId" | "createdAt">,
  ) {
    this.requirePortfolioItem(portfolioItemId);

    if (input.projectedRisk < 0 || input.projectedRisk > 100) {
      throw new Error("Projected risk must be between 0 and 100");
    }

    const scenario: UltimateScenario = {
      ...input,
      id: randomUUID(),
      portfolioItemId,
      assumptions: { ...input.assumptions },
      createdAt: new Date().toISOString(),
    };

    this.scenarios.set(scenario.id, scenario);
    return this.cloneScenario(scenario);
  }

  recordScorecard(
    portfolioItemId: string,
    input: Omit<UltimateScorecard, "id" | "portfolioItemId" | "status" | "recordedAt">,
  ) {
    this.requirePortfolioItem(portfolioItemId);

    const ratio =
      input.targetValue === 0 ? 1 : input.actualValue / input.targetValue;

    const scorecard: UltimateScorecard = {
      ...input,
      id: randomUUID(),
      portfolioItemId,
      status:
        ratio >= 1
          ? "ON_TRACK"
          : ratio >= 0.8
            ? "AT_RISK"
            : "OFF_TRACK",
      recordedAt: new Date().toISOString(),
    };

    this.scorecards.set(scorecard.id, scorecard);
    return { ...scorecard };
  }

  completePortfolioItem(id: string) {
    const item = this.requirePortfolioItem(id);

    const scenarioCount = Array.from(this.scenarios.values()).filter(
      (scenario) => scenario.portfolioItemId === id,
    ).length;

    const scorecardCount = Array.from(this.scorecards.values()).filter(
      (scorecard) => scorecard.portfolioItemId === id,
    ).length;

    if (scenarioCount === 0) {
      throw new Error("At least one scenario is required");
    }

    if (scorecardCount === 0) {
      throw new Error("At least one scorecard is required");
    }

    item.status = "COMPLETED";
    item.updatedAt = new Date().toISOString();
    this.portfolio.set(id, item);

    return { ...item };
  }

  listPortfolio(
    capability?: UltimatePlatformCapability,
    tenantId?: string,
  ) {
    return Array.from(this.portfolio.values())
      .filter((item) => !capability || item.capability === capability)
      .filter((item) => !tenantId || item.tenantId === tenantId)
      .map((item) => ({ ...item }));
  }

  commandCenter() {
    const portfolio = Array.from(this.portfolio.values());
    const scenarios = Array.from(this.scenarios.values());
    const scorecards = Array.from(this.scorecards.values());

    return {
      system: "AVOS Ultimate Platform Completion Bundle V1",
      capabilities: Object.keys(ULTIMATE_PLATFORM_CAPABILITIES).length,
      portfolioItems: portfolio.length,
      activePortfolioItems: portfolio.filter(
        (item) => item.status === "ACTIVE",
      ).length,
      completedPortfolioItems: portfolio.filter(
        (item) => item.status === "COMPLETED",
      ).length,
      scenarios: scenarios.length,
      scorecards: scorecards.length,
      onTrackScorecards: scorecards.filter(
        (item) => item.status === "ON_TRACK",
      ).length,
      totalInvestment: Number(
        portfolio
          .reduce((sum, item) => sum + item.investmentAmount, 0)
          .toFixed(2),
      ),
      averageStrategicScore:
        portfolio.length === 0
          ? 0
          : Number(
              (
                portfolio.reduce(
                  (sum, item) => sum + item.strategicScore,
                  0,
                ) / portfolio.length
              ).toFixed(2),
            ),
      generatedAt: new Date().toISOString(),
    };
  }

  private requirePortfolioItem(id: string) {
    const item = this.portfolio.get(id);

    if (!item) {
      throw new Error(`Portfolio item not found: ${id}`);
    }

    return item;
  }

  private cloneScenario(scenario: UltimateScenario): UltimateScenario {
    return {
      ...scenario,
      assumptions: { ...scenario.assumptions },
    };
  }
}