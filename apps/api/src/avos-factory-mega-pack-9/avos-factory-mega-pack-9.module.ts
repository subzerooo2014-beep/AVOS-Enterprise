import { Module } from "@nestjs/common";
import {
  AvosFactoryMegaPack8Module
} from "../avos-factory-mega-pack-8/avos-factory-mega-pack-8.module";
import {
  GeneratorRuntimeController
} from "./generator-runtime.controller";
import {
  GeneratorRuntimeService
} from "./generator-runtime.service";
import {
  PluginResolverService
} from "./plugin-resolver.service";
import {
  RuntimeValidationService
} from "./runtime-validation.service";
import {
  ExecutionHistoryService
} from "./execution-history.service";
import {
  RuntimeMetricsService
} from "./runtime-metrics.service";

@Module({
  imports: [
    AvosFactoryMegaPack8Module
  ],
  controllers: [
    GeneratorRuntimeController
  ],
  providers: [
    GeneratorRuntimeService,
    PluginResolverService,
    RuntimeValidationService,
    ExecutionHistoryService,
    RuntimeMetricsService
  ],
  exports: [
    GeneratorRuntimeService,
    PluginResolverService,
    RuntimeValidationService,
    ExecutionHistoryService,
    RuntimeMetricsService
  ]
})
export class AvosFactoryMegaPack9Module {}
