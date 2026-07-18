import { Injectable } from "@nestjs/common";

export interface BlueprintDefinition {

    name: string;

    output: string;

    capabilities: string[];

}

@Injectable()
export class BlueprintEngine {

    async load(path: string): Promise<BlueprintDefinition> {

        throw new Error("Blueprint loading not implemented.");

    }

    async validate(blueprint: BlueprintDefinition): Promise<void> {

    }

}
