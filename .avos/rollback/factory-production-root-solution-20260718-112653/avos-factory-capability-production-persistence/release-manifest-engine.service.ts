import { Injectable } from "@nestjs/common";

@Injectable()
export class ReleaseManifestEngineService {
  create(input: {
    capabilityName: string;
    version: string;
    environment: string;
  }) {
    return {
      releaseId:
        `release:${input.capabilityName}:${input.version}`,
      capabilityName: input.capabilityName,
      version: input.version,
      environment: input.environment,
      immutableManifest: true,
      artifacts: [
        "source",
        "contracts",
        "tests",
        "documentation",
        "verification-report"
      ],
      createdAt: new Date().toISOString(),
      score: 100
    };
  }
}
