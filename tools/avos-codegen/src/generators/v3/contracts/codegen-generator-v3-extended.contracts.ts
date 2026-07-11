import {
  CodeGenArtifactDescriptor,
} from "../../../artifacts/codegen-artifact.contracts";
import {
  CodeGenGeneratorV3Request,
  CodeGenGeneratorV3Result,
} from "./codegen-generator-v3.contracts";
import {
  CodeGenQualityReport,
} from "../../../quality/contracts/codegen-quality.contracts";
import {
  CodeGenValidationReport,
} from "../../../validation/contracts/codegen-validation.contracts";

export interface CodeGenGeneratorV3ExtendedRequest
  extends CodeGenGeneratorV3Request {
  includeRepository: boolean;
  includePagination: boolean;
  includeFiltering: boolean;
  includeOpenApi: boolean;
  includeIntegrationTests: boolean;
  includePrismaAdapter: boolean;
}

export interface CodeGenGeneratorV3PipelineResult {
  success: boolean;
  generation: CodeGenGeneratorV3Result;
  artifacts: CodeGenArtifactDescriptor[];
  quality?: CodeGenQualityReport;
  validation?: CodeGenValidationReport;
  warnings: string[];
  errors: string[];
  generatedAt: string;
}
