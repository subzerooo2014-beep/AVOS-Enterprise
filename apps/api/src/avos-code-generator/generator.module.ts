import { Module } from "@nestjs/common";

import { GeneratorController } from "./generator.controller";

import { GeneratorEngine } from "./core/generator.engine";
import { BlueprintEngine } from "./core/blueprint.engine";
import { BlueprintLoaderEngine } from "./core/blueprint-loader.engine";
import { TemplateEngine } from "./core/template.engine";
import { TemplateRepositoryEngine } from "./core/template-repository.engine";
import { FileSystemEngine } from "./core/filesystem.engine";

import { ExecutionPlannerEngine } from "./execution/execution-planner.engine";
import { ExecutionPipelineEngine } from "./execution/execution-pipeline.engine";

import { BuilderRegistry } from "./registry/builder.registry";

import { PackBuilder } from "./builders/pack.builder";
import { ModuleBuilder } from "./builders/module.builder";

@Module({
    controllers: [
        GeneratorController,
    ],
    providers: [
        GeneratorEngine,

        BlueprintEngine,
        BlueprintLoaderEngine,

        TemplateEngine,
        TemplateRepositoryEngine,
        FileSystemEngine,

        ExecutionPlannerEngine,
        ExecutionPipelineEngine,

        BuilderRegistry,

        PackBuilder,
        ModuleBuilder,
    ],
    exports: [
        GeneratorEngine,
    ],
})
export class AvosCodeGeneratorModule {}
