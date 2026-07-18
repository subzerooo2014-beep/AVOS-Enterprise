import { Injectable } from "@nestjs/common";
import { BuilderRegistry } from "../registry/builder.registry";
import { ExecutionContext } from "./execution-context";
import { ExecutionPlannerEngine } from "./execution-planner.engine";

@Injectable()
export class ExecutionPipelineEngine {

    constructor(
        private readonly planner: ExecutionPlannerEngine,
        private readonly registry: BuilderRegistry,
    ) {}

    async execute(
        context: ExecutionContext,
    ): Promise<void> {

        const plan = this.planner.createPlan(context);

        for (const step of plan) {

            const builder =
                this.registry.get(step.capability);

            await builder.build(
                context.blueprint,
                context.output,
            );

        }

    }

}
