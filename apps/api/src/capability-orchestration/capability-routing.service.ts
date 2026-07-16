import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CapabilityRegistryService } from "../capability-fabric/capability-registry.service";
import {
  CapabilityRouteDefinition,
  CapabilityRouteStrategy,
} from "./capability-orchestration.types";

@Injectable()
export class CapabilityRoutingService {
  private readonly routes = new Map<string, CapabilityRouteDefinition>();
  private readonly counters = new Map<string, number>();

  constructor(private readonly registry: CapabilityRegistryService) {}

  register(input: {
    routeKey: string;
    strategy: CapabilityRouteStrategy;
    candidates: CapabilityRouteDefinition["candidates"];
    fallbackCapabilityKey?: string;
  }) {
    const key = input.routeKey.trim().toLowerCase();

    if (this.routes.has(key)) {
      return { success: false, reason: "ROUTE_ALREADY_EXISTS" };
    }

    const missing = input.candidates
      .filter((candidate) => !this.registry.get(candidate.capabilityKey))
      .map((candidate) => candidate.capabilityKey);

    if (missing.length > 0) {
      return {
        success: false,
        reason: "ROUTE_CONTAINS_UNREGISTERED_CAPABILITIES",
        missing,
      };
    }

    const now = new Date().toISOString();
    const route: CapabilityRouteDefinition = {
      id: randomUUID(),
      routeKey: key,
      strategy: input.strategy,
      candidates: structuredClone(input.candidates),
      fallbackCapabilityKey: input.fallbackCapabilityKey,
      createdAt: now,
      updatedAt: now,
    };

    this.routes.set(key, route);
    return { success: true, route: structuredClone(route) };
  }

  resolve(routeKey: string, tags: string[] = []) {
    const route = this.routes.get(routeKey.toLowerCase());
    if (!route) {
      return { success: false, reason: "ROUTE_NOT_FOUND" };
    }

    const candidates = route.candidates.filter((candidate) => {
      const capability = this.registry.get(candidate.capabilityKey);
      if (!capability) return false;

      if (
        candidate.requiredHealth === "HEALTHY" &&
        capability.operationalStatus !== "ACTIVE"
      ) {
        return false;
      }

      return tags.length === 0
        ? true
        : tags.every((tag) => candidate.tags.includes(tag.toLowerCase()));
    });

    if (candidates.length === 0) {
      return route.fallbackCapabilityKey
        ? {
            success: true,
            fallback: true,
            capabilityKey: route.fallbackCapabilityKey,
            operation: "execute",
            strategy: route.strategy,
          }
        : { success: false, reason: "NO_ROUTE_CANDIDATE" };
    }

    const selected = this.select(route.routeKey, route.strategy, candidates);

    return {
      success: true,
      fallback: false,
      capabilityKey: selected.capabilityKey,
      operation: selected.operation,
      strategy: route.strategy,
    };
  }

  list() {
    return [...this.routes.values()].map((route) => structuredClone(route));
  }

  private select(
    routeKey: string,
    strategy: CapabilityRouteStrategy,
    candidates: CapabilityRouteDefinition["candidates"],
  ) {
    if (strategy === "HIGHEST_PRIORITY" || strategy === "AI_ASSISTED") {
      return [...candidates].sort(
        (a, b) =>
          b.priority - a.priority ||
          b.weight - a.weight ||
          a.capabilityKey.localeCompare(b.capabilityKey),
      )[0];
    }

    if (strategy === "WEIGHTED") {
      return [...candidates].sort(
        (a, b) =>
          b.weight - a.weight ||
          b.priority - a.priority,
      )[0];
    }

    if (strategy === "ROUND_ROBIN") {
      const current = this.counters.get(routeKey) ?? 0;
      const selected = candidates[current % candidates.length];
      this.counters.set(routeKey, current + 1);
      return selected;
    }

    return candidates[0];
  }
}