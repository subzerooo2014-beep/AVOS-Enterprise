import { Injectable } from "@nestjs/common";
import * as fs from "node:fs";
import * as path from "node:path";
import { BlueprintDefinition } from "./blueprint.engine";

@Injectable()
export class BlueprintLoaderEngine {

    async load(filePath: string): Promise<BlueprintDefinition> {

        const fullPath = path.resolve(filePath);

        if (!fs.existsSync(fullPath)) {

            throw new Error(`Blueprint not found: ${fullPath}`);

        }

        const content = fs.readFileSync(fullPath, "utf8");

        return JSON.parse(content) as BlueprintDefinition;

    }

}
