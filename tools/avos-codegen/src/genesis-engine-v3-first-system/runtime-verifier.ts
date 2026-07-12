import { GenesisV3GenerationResult } from "./orchestrator";

export interface GenesisV3Health {
  healthy: boolean;
  status: string;
  score: number;
  totalFiles: number;
  backendFiles: number;
  prismaFiles: number;
  frontendFiles: number;
  dockerFiles: number;
  ciFiles: number;
  documentationFiles: number;
  registrationFiles: number;
  completionPercent: number;
}

export class GenesisV3RuntimeVerifier {
  verify(result: GenesisV3GenerationResult): GenesisV3Health {
    return {
      healthy:
        result.success &&
        result.report.totalFiles > 0 &&
        result.report.backendFiles > 0 &&
        result.report.prismaFiles > 0 &&
        result.report.documentationFiles > 0 &&
        result.report.registrationFiles >= 3 &&
        result.report.completionPercent === 100,
      status: result.status,
      score: result.score,
      totalFiles: result.report.totalFiles,
      backendFiles: result.report.backendFiles,
      prismaFiles: result.report.prismaFiles,
      frontendFiles: result.report.frontendFiles,
      dockerFiles: result.report.dockerFiles,
      ciFiles: result.report.ciFiles,
      documentationFiles: result.report.documentationFiles,
      registrationFiles: result.report.registrationFiles,
      completionPercent: result.report.completionPercent,
    };
  }
}
