import { Body, Controller, Get, Post } from "@nestjs/common";
import {
    GeneratorEngine,
    GeneratorRequest,
} from "./core/generator.engine";

@Controller("avos/code-generator")
export class GeneratorController {

    constructor(
        private readonly generatorEngine: GeneratorEngine,
    ) {}

    @Get("status")
    status(): {
        system: string;
        status: string;
        version: string;
    } {

        return {
            system: "AVOS Code Generator",
            status: "ready",
            version: "0.1.0",
        };

    }

    @Post("generate")
    async generate(
        @Body() request: GeneratorRequest,
    ): Promise<{
        success: boolean;
        blueprint: string;
        output: string;
    }> {

        await this.generatorEngine.generate(request);

        return {
            success: true,
            blueprint: request.blueprint,
            output: request.output,
        };

    }

}
