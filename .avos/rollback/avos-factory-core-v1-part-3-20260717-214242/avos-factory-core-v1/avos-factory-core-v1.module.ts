import { Module } from "@nestjs/common";
import {
  BlueprintEngineService
} from "./blueprint-engine.service";
import {
  BlueprintHistoryService
} from "./blueprint-history.service";
import {
  BlueprintMetricsService
} from "./blueprint-metrics.service";
import {
  BlueprintParserService
} from "./blueprint-parser.service";
import {
  BlueprintPlannerService
} from "./blueprint-planner.service";
import {
  BlueprintRegistryService
} from "./blueprint-registry.service";
import {
  BlueprintValidationService
} from "./blueprint-validation.service";
import {
  CodeGenerationBootstrapService
} from "./code-generation-bootstrap.service";
import {
  CodeGenerationEngineService
} from "./code-generation-engine.service";
import {
  CodeGenerationProviderRegistryService
} from "./code-generation-provider-registry.service";
import {
  CodeGenerationValidationService
} from "./code-generation-validation.service";
import {
  GenerationHistoryService
} from "./generation-history.service";
import {
  GenerationMetricsService
} from "./generation-metrics.service";
import {
  GenerationOutputManagerService
} from "./generation-output-manager.service";
import {
  TypeScriptCodeGenerationProvider
} from "./typescript-code-generation.provider";

@Module({
  providers: [
    BlueprintRegistryService,
    BlueprintValidationService,
    BlueprintParserService,
    BlueprintPlannerService,
    BlueprintHistoryService,
    BlueprintMetricsService,
    BlueprintEngineService,

    CodeGenerationProviderRegistryService,
    CodeGenerationValidationService,
    GenerationOutputManagerService,
    GenerationHistoryService,
    GenerationMetricsService,
    TypeScriptCodeGenerationProvider,
    CodeGenerationBootstrapService,
    CodeGenerationEngineService
  ],
  exports: [
    BlueprintRegistryService,
    BlueprintValidationService,
    BlueprintParserService,
    BlueprintPlannerService,
    BlueprintHistoryService,
    BlueprintMetricsService,
    BlueprintEngineService,

    CodeGenerationProviderRegistryService,
    CodeGenerationValidationService,
    GenerationOutputManagerService,
    GenerationHistoryService,
    GenerationMetricsService,
    TypeScriptCodeGenerationProvider,
    CodeGenerationEngineService
  ]
})
export class AvosFactoryCoreV1Module {}
