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

@Module({
  providers: [
    BlueprintRegistryService,
    BlueprintValidationService,
    BlueprintParserService,
    BlueprintPlannerService,
    BlueprintHistoryService,
    BlueprintMetricsService,
    BlueprintEngineService
  ],
  exports: [
    BlueprintRegistryService,
    BlueprintValidationService,
    BlueprintParserService,
    BlueprintPlannerService,
    BlueprintHistoryService,
    BlueprintMetricsService,
    BlueprintEngineService
  ]
})
export class AvosFactoryCoreV1Module {}
