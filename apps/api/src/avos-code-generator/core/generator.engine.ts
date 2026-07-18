import { Injectable, Logger } from "@nestjs/common";
import { BlueprintDefinition, BlueprintEngine } from "./blueprint.engine";
import { BlueprintLoaderEngine } from "./blueprint-loader.engine";
import { ExecutionContext } from "../execution/execution-context";
import { ExecutionPipelineEngine } from "../execution/execution-pipeline.engine";

export interface GeneratorRequest {

    blueprint: string;

    output: string;

}

@Injectable()
export class GeneratorEngine {

    private readonly logger = new Logger(GeneratorEngine.name);

    constructor(
        private readonly loader: BlueprintLoaderEngine,
        private readonly blueprintEngine: BlueprintEngine,
        private readonly pipeline: ExecutionPipelineEngine,
    ) {}

    async generate(
        request: GeneratorRequest,
    ): Promise<void> {

        this.logger.log("Starting AVOS Code Generator...");

        const blueprint: BlueprintDefinition =
            await this.loader.load(request.blueprint);

        await this.blueprintEngine.validate(blueprint);

        const context: ExecutionContext = {

            blueprint,

            output: request.output,

            generatedFiles: [],

            generatedDirectories: [],

            metadata: {},

            startedAt: new Date(),

        };

        await this.pipeline.execute(context);

        this.logger.log("Generation completed.");

    }

}
