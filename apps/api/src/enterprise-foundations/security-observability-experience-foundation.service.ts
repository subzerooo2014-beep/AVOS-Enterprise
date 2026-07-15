import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { SecurityObservation } from "./enterprise-foundations.types";

@Injectable()
export class SecurityObservabilityExperienceFoundationService {
  private readonly observations =
    new Map<string, SecurityObservation>();

  record(
    input: Omit<
      SecurityObservation,
      "id" | "resolved" | "createdAt" | "resolvedAt"
    >,
  ): SecurityObservation {
    const observation: SecurityObservation = {
      ...input,
      id: randomUUID(),
      metadata: { ...input.metadata },
      resolved: false,
      createdAt: new Date().toISOString(),
    };

    this.observations.set(observation.id, observation);
    return this.clone(observation);
  }

  resolve(id: string): SecurityObservation {
    const observation = this.requireObservation(id);

    observation.resolved = true;
    observation.resolvedAt = new Date().toISOString();

    this.observations.set(id, observation);
    return this.clone(observation);
  }

  dashboard() {
    const observations = Array.from(this.observations.values());

    return {
      observations: observations.length,
      criticalOpen: observations.filter(
        (item) => item.severity === "CRITICAL" && !item.resolved,
      ).length,
      securityEvents: observations.filter(
        (item) =>
          item.category === "THREAT" ||
          item.category === "INCIDENT",
      ).length,
      observabilitySignals: observations.filter(
        (item) =>
          item.category === "LOG" ||
          item.category === "METRIC" ||
          item.category === "TRACE",
      ).length,
      accessibilitySignals: observations.filter(
        (item) => item.category === "ACCESSIBILITY",
      ).length,
      experienceSignals: observations.filter(
        (item) => item.category === "EXPERIENCE",
      ).length,
      resolved: observations.filter((item) => item.resolved).length,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireObservation(id: string): SecurityObservation {
    const observation = this.observations.get(id);

    if (!observation) {
      throw new Error(`Observation not found: ${id}`);
    }

    return observation;
  }

  private clone(
    observation: SecurityObservation,
  ): SecurityObservation {
    return {
      ...observation,
      metadata: { ...observation.metadata },
    };
  }
}