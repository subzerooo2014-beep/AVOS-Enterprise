import { Injectable } from "@nestjs/common";

@Injectable()
export class KnowledgeCompatibilityService {
  evaluate(input: { sourceVersion: number; targetVersion: number; dependencyVersions?: number[] }) {
    const dependencyVersions = input.dependencyVersions ?? [];
    const forwardOnly = input.targetVersion > input.sourceVersion;
    const dependenciesCompatible = dependencyVersions.every((version) => version <= input.targetVersion);
    return { compatible: forwardOnly && dependenciesCompatible, forwardOnly, dependenciesCompatible, checkedAt: new Date().toISOString() };
  }
}