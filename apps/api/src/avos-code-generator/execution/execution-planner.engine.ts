import { Injectable } from "@nestjs/common";
import { ExecutionContext } from "./execution-context";

export interface ExecutionStep {

    capability: string;

    order: number;

}

@Injectable()
export class ExecutionPlannerEngine {

    createPlan(
        context: ExecutionContext,
    ): ExecutionStep[] {

        return context.blueprint.capabilities
            .map((capability, index) => ({
                capability,
                order: index + 1,
            }))
            .sort((a, b) => a.order - b.order);

    }

}
