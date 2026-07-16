import { Injectable } from "@nestjs/common";
import {
  NervousSignalEnvelope,
  NervousSubscriptionFilter
} from "../enterprise-nervous-system-mega-pack-2.types";

@Injectable()
export class NervousFilterEngineService {
  evaluate(
    signal: NervousSignalEnvelope,
    filters: NervousSubscriptionFilter[]
  ) {
    const active = filters.filter((filter) => filter.active);

    const results = active.map((filter) => ({
      filterId: filter.id,
      passed: this.evaluateOne(signal, filter)
    }));

    return {
      passed: results.every((result) => result.passed),
      results
    };
  }

  private evaluateOne(
    signal: NervousSignalEnvelope,
    filter: NervousSubscriptionFilter
  ) {
    const value = this.readField(signal, filter.field);

    switch (filter.operator) {
      case "eq":
        return value === filter.value;
      case "neq":
        return value !== filter.value;
      case "contains":
        return String(value ?? "").includes(String(filter.value ?? ""));
      case "starts-with":
        return String(value ?? "").startsWith(String(filter.value ?? ""));
      case "ends-with":
        return String(value ?? "").endsWith(String(filter.value ?? ""));
      case "gt":
        return Number(value) > Number(filter.value);
      case "gte":
        return Number(value) >= Number(filter.value);
      case "lt":
        return Number(value) < Number(filter.value);
      case "lte":
        return Number(value) <= Number(filter.value);
      case "in":
        return Array.isArray(filter.value) &&
          filter.value.includes(value);
      case "not-in":
        return Array.isArray(filter.value) &&
          !filter.value.includes(value);
      default:
        return false;
    }
  }

  private readField(
    signal: NervousSignalEnvelope,
    path: string
  ) {
    const segments = path.split(".");
    let current: unknown = signal;

    for (const segment of segments) {
      if (
        current === null ||
        typeof current !== "object"
      ) {
        return undefined;
      }

      current = (current as Record<string, unknown>)[segment];
    }

    return current;
  }
}
