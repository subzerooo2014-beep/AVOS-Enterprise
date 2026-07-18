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
import {
  BuiltInTemplateBootstrapService
} from "./built-in-template-bootstrap.service";
import {
  TemplateCompositionService
} from "./template-composition.service";
import {
  TemplateEngineService
} from "./template-engine.service";
import {
  TemplateHistoryService
} from "./template-history.service";
import {
  TemplateMetricsService
} from "./template-metrics.service";
import {
  TemplateParserService
} from "./template-parser.service";
import {
  TemplateRegistryService
} from "./template-registry.service";
import {
  TemplateRendererService
} from "./template-renderer.service";
import {
  TemplateValidationService
} from "./template-validation.service";

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
    CodeGenerationEngineService,

    TemplateRegistryService,
    TemplateValidationService,
    TemplateParserService,
    TemplateRendererService,
    TemplateCompositionService,
    TemplateHistoryService,
    TemplateMetricsService,
    TemplateEngineService,
    BuiltInTemplateBootstrapService
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
    CodeGenerationEngineService,

    TemplateRegistryService,
    TemplateValidationService,
    TemplateParserService,
    TemplateRendererService,
    TemplateCompositionService,
    TemplateHistoryService,
    TemplateMetricsService,
    TemplateEngineService
  ]
})
export class AvosFactoryCoreV1Module {}
