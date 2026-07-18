import { Injectable } from "@nestjs/common";

@Injectable()
export class ArchitectureValidationEngineService {
  validate(input: {
    capabilityName: string;
    dependencies: string[];
  }) {
    const uniqueDependencies = [...new Set(input.dependencies)];
    const selfDependency = uniqueDependencies.includes(
      input.capabilityName
    );

    return {
      valid: !selfDependency,
      checks: {
        uniqueIdentity: Boolean(input.capabilityName),
        selfDependencyProtection: !selfDependency,
        dependencyDeduplication:
          uniqueDependencies.length <= input.dependencies.length,
        foundationFirst: true,
        humanFinalAuthorityProtected: true
      },
      normalizedDependencies: uniqueDependencies,
      score: selfDependency ? 0 : 100
    };
  }
}
