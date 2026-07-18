import { BlueprintDefinition } from "../core/blueprint.engine";

export interface ExecutionContext {

    blueprint: BlueprintDefinition;

    output: string;

    generatedFiles: string[];

    generatedDirectories: string[];

    metadata: Record<string, unknown>;

    startedAt: Date;

}
